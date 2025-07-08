#!/usr/bin/env bash

git clone -b v7.22.20 --depth 1 https://github.com/babel/babel package
cd package
git switch -c v7.22

#git status
#git clean -fdxn

# Install dependencies
git apply --reject --unidiff-zero --ignore-whitespace --whitespace=nowarn --include={package.json,.yarnrc.yml,yarn.lock} ../scripts/fix-deps.patch
sed -i 's/\bcondition: *BABEL_8_BREAKING *?[^:]*: *\([^ ()]*\)\( *([^()]*)\)\?/\1/g' packages/*/package.json yarn.lock
git add packages/*/package.json

node .yarn/releases/*.cjs

rm "node_modules/@babel/core-7.12"
mkdir "node_modules/@babel/core-7.12"

find . -type d -path "*/node_modules/.bin" -exec rm -rf {} +
find packages -type d -name node_modules -empty -delete

rm -rf packages/babel-code-frame/node_modules
ln -s "$PWD/packages/babel-highlight/node_modules" packages/babel-code-frame/
#git clean -fdxn | sed -E "s/^([A-Z]?[a-z]+ +)+//" | tar -czf ../node_modules.tgz -T -

# Link built packages
#ls -1ap ../node_modules/@babel/*/ | grep -vE "^(\.+/|\.\./node_modules/.*:|package\.json|LICENSE.*|[A-Z]*\.md)$" | sort | uniq
for fn in packages/babel-*; do [ -d "../node_modules/@babel/${fn:15}" ] && ln -s "$PWD/../node_modules/@babel/${fn:15}/lib" "$fn/lib" || true; done

ln -s "$PWD/../node_modules/@babel/runtime"/helpers/*.js packages/babel-runtime/helpers/ || true
ln -s "$PWD/../node_modules/@babel/runtime"/helpers/esm/*.js packages/babel-runtime/helpers/esm/ || true
#7za a -stl -tZip ../libs.zip `find packages/*/ -maxdepth 3 -type l \( -name lib -o -name "*.js" \)`

# Apply patches
git add -f `grep "^--- a\(/packages/.*\)\?/node_modules/" ../scripts/fix-deps.patch | sed "s,^--- a/,,"`
( cd .. ; git add -f `grep "^--- a/\.\./node_modules/" scripts/fix-deps.patch | sed "s,^--- a/\.\./,,"` )

git apply --reject --unidiff-zero --ignore-whitespace --whitespace=nowarn --exclude={package.json,.yarnrc.yml,yarn.lock} --unsafe-paths ../scripts/fix-deps.patch

## Mixed mode
git add -f node_modules/{convert-source-map,browserslist}/package.json
sed -i -E 's/^(   +)"(path|fs)": *false\b/\1"\2": null/' node_modules/{convert-source-map,browserslist}/package.json

find node_modules -type f -path "*/@jridgewell/*/package.json" -not -path "node_modules/@cs*" -exec git add -f {} \; \
 -exec sed -i -e 's/^\(    *\)"import":/\1"default":/' -e 's/^\(    *\)"browser\(": *".*\)\.umd\.js"/\1"import\2.mjs",\n&/' {} \;

sed -i 's/^  "browser":/  "_browser":/' packages/babel-{core,plugin-transform-runtime}/package.json
printf "module" > .module-type

#7za a -stl -tZip ../mixed.zip .module-type \
#`( git status | grep -P "^\t" | sed "s/^\t\([a-z][a-z ]*: *\)\?//" ; \
#cd .. ; git status | grep -P "^\t.* node_modules/" | sed "s,^\t[a-z][a-z ]*: *node_modules/@babel/,packages/babel-," ) | sort | uniq`

# Building
#( cd packages/babel-plugin-transform-runtime && node scripts/build-dist.js )
node --env-file=.env node_modules/gulp/bin/gulp.js build-vendor generate-standalone
git add -f packages/babel-core/src/vendor/import-meta-resolve.js # packages/babel-standalone/src/generated/plugins.ts

node --env-file=.env node_modules/gulp/bin/gulp.js rollup-babel-standalone

git add -f packages/babel-standalone/*.js
## Refactor
sed -i "s/^\( *\)\t/\1  /g" packages/babel-standalone/*.js
sed -i -e "s/^exports\.\([A-Za-z0-9_]*\) = \1;$/  \1,/" -e "s/^exports\.\([A-Za-z0-9_]*\) = \([A-Za-z0-9_$]*\);$/  \1: \2,/" packages/babel-standalone/{common,types,vendors,babel}.js

sed -i 's,^\([ \t]*"/\)node_modules/regenerate-unicode-properties/,\1,' packages/babel-standalone/vendors.js
perl -i -0pe \
 's/^var ([\w\$]+) = (.*);\n+var (hasRequired[\w\$]+);\n+(function require[\w\$]+\(\) \{)(\n[ \t]+)if \(\3\) return \1;\5\3 = 1;$/var \1;\n\4\5if \(\1\) return \1;\5\1 = \2;/gm' \
 packages/babel-standalone/vendors.js

perl -i -0pe "s/= \((superClass =>.*\{\n[\s\S]*?\n\})\);$/= \1;/gm" packages/babel-standalone/parser.js

sed -i "s, = require('@babel/, = require('./," packages/babel-standalone/*.js
sed -i -e "s/\<helperValidatorIdentifier\>/common/g" -e "s,/helper-validator-identifier',/common.js'," packages/babel-standalone/{template,babel}.js

sed -i -e "s/\<browser\>/supportsColor_1/" -e "s/\<\(const scLevel = \)0;$/\1stdoutColor ? stdoutColor.level : 0;/" packages/babel-standalone/template.js

sed -i -e "s/\<browser\$1\>/buildDebug/" -e "s/\<setupDebug\>/setup\$1/" packages/babel-standalone/traverse.js
perl -i -0pe 's/ = \((\([^\(\),]*\) => \(?\{\n[\s\S]*?\n\}\)?)\);$/ = \1;/gm' packages/babel-standalone/babel.js
