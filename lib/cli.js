#!/usr/bin/env node
'use strict';

var http = require('http'),
  net = require('net'),
  path = require('path'),
  _libs = require('./vendors'),
  commander = _libs.commander,
  fs = require('fs'),
  lockfile = _libs['proper-lockfile'],
  loudRejection = _libs['loud-rejection'],
  onDeath = _libs.death,
  semver = _libs.semver,
  os = require('os'),
  util = require('util'),
  events = require('events'),
  tty = require('tty'),
  readline = require('readline'),
  chalk = _libs.chalk,
  _camelCase = _libs.camelcase,
  inquirer = _libs.inquirer,
  Table = _libs['cli-table3'],
  stripAnsi = _libs['strip-ansi'],
  read = _libs.read,
  globModule = _libs.glob,
  micromatch = _libs.micromatch,
  ssri = _libs.ssri,
  objectPath = _libs['object-path'],
  normalizeUrl = _libs['normalize-url'],
  url = require('url'),
  ini = _libs.ini,
  Lockfile = require('./lockfile'),
  string_decoder = require('string_decoder'),
  tarFs = _libs['tar-fs'],
  tarStream = _libs['tar-stream'],
  child = require('child_process'),
  crypto = require('crypto'),
  stream = require('stream'),
  uuid = _libs.uuid,
  validateLicense = _libs['validate-npm-package-license'],
  cmdShim = _libs['cmd-shim'],
  gunzip = _libs['gunzip-maybe'],
  dnscache = _libs.dnscache,
  RequestCaptureHar = _libs['request-capture-har'],
  detectIndent = _libs['detect-indent'],
  zlib = require('zlib'),
  resolve = _libs.resolve,
  minimatch = _libs.minimatch,
  deepEqual = _libs['deep-equal'],
  emoji = _libs['node-emoji'],
  leven = _libs.leven,
  puka = _libs.puka,
  npmLogicalTree = _libs['npm-logical-tree'],
  yn = _libs.yn,
  bytes = _libs.bytes,

  NODE_ENV = process.env.NODE_ENV;

var invariant = function(condition, format, a, b, c, d, e, f) {
  if (NODE_ENV !== 'production' && format === void 0)
    throw new Error('invariant requires an error message argument');

  if (!condition) {
    var error;
    if (format === void 0)
      error = new Error(
        'Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings.'
      );
    else {
      var args = [a, b, c, d, e, f],
        argIndex = 0;
      error = new Error(format.replace(/%s/g, () => args[argIndex++]));
      error.name = 'Invariant Violation';
    }

    error.framesToPop = 1;
    throw error;
  }
};

function formatFunction(...strs) {
  return strs.join(' ');
}

const defaultFormatter = {
  bold: formatFunction,
  dim: formatFunction,
  italic: formatFunction,
  underline: formatFunction,
  inverse: formatFunction,
  strikethrough: formatFunction,
  black: formatFunction,
  red: formatFunction,
  green: formatFunction,
  yellow: formatFunction,
  blue: formatFunction,
  magenta: formatFunction,
  cyan: formatFunction,
  white: formatFunction,
  gray: formatFunction,
  grey: formatFunction,
  stripColor: formatFunction,
};

const messages = {
  upToDate: 'Already up-to-date.',
  folderInSync: 'Folder in sync.',
  nothingToInstall: 'Nothing to install.',
  resolvingPackages: 'Resolving packages',
  checkingManifest: 'Validating package.json',
  fetchingPackages: 'Fetching packages',
  linkingDependencies: 'Linking dependencies',
  rebuildingPackages: 'Rebuilding all packages',
  buildingFreshPackages: 'Building fresh packages',
  cleaningModules: 'Cleaning modules',
  bumpingVersion: 'Bumping version',
  savingHar: 'Saving HAR file: $0',
  answer: 'Answer?',
  usage: 'Usage',
  installCommandRenamed: '`install` has been replaced with `add` to add new dependencies. Run $0 instead.',
  globalFlagRemoved: '`--global` has been deprecated. Please run $0 instead.',
  waitingInstance: 'Waiting for the other yarn instance to finish (pid $0, inside $1)',
  waitingNamedInstance: 'Waiting for the other yarn instance to finish ($0)',
  offlineRetrying: 'There appears to be trouble with your network connection. Retrying...',
  internalServerErrorRetrying: 'There appears to be trouble with the npm registry (returned $1). Retrying...',
  clearedCache: 'Cleared cache.',
  couldntClearPackageFromCache: "Couldn't clear package $0 from cache",
  clearedPackageFromCache: 'Cleared package $0 from cache',
  packWroteTarball: 'Wrote tarball to $0.',
  invalidBinField: 'Invalid bin field for $0.',
  invalidBinEntry: 'Invalid bin entry for $1 (in $0).',
  helpExamples: '  Examples:\n$0\n',
  helpCommands: '  Commands:\n$0\n',
  helpCommandsMore: '  Run `$0` for more information on specific commands.',
  helpLearnMore: '  Visit $0 to learn more about Yarn.\n',

  manifestPotentialTypo: 'Potential typo $0, did you mean $1?',
  manifestBuiltinModule: '$0 is also the name of a node core module',
  manifestNameDot: "Name can't start with a dot",
  manifestNameIllegalChars: 'Name contains illegal characters',
  manifestNameBlacklisted: 'Name is blacklisted',
  manifestLicenseInvalid: 'License should be a valid SPDX license expression',
  manifestLicenseNone: 'No license field',
  manifestStringExpected: '$0 is not a string',
  manifestDependencyCollision:
    '$0 has dependency $1 with range $2 that collides with a dependency in $3 of the same name with version $4',
  manifestDirectoryNotFound: 'Unable to read $0 directory of module $1',

  verboseFileCopy: 'Copying $0 to $1.',
  verboseFileLink: 'Creating hardlink at $0 to $1.',
  verboseFileSymlink: 'Creating symlink at $0 to $1.',
  verboseFileSkip: 'Skipping copying of file $0 as the file at $1 is the same size ($2) and mtime ($3).',
  verboseFileSkipSymlink: 'Skipping copying of $0 as the file at $1 is the same symlink ($2).',
  verboseFileSkipHardlink: 'Skipping copying of $0 as the file at $1 is the same hardlink ($2).',
  verboseFileRemoveExtraneous: 'Removing extraneous file $0.',
  verboseFilePhantomExtraneous:
    "File $0 would be marked as extraneous but has been removed as it's listed as a phantom file.",
  verboseFileSkipArtifact: 'Skipping copying of $0 as the file is marked as a built artifact and subject to change.',
  verboseFileFolder: 'Creating directory $0.',

  verboseRequestStart: 'Performing $0 request to $1.',
  verboseRequestFinish: 'Request $0 finished with status code $1.',

  configSet: 'Set $0 to $1.',
  configDelete: 'Deleted $0.',
  configNpm: 'npm config',
  configYarn: 'yarn config',

  couldntFindPackagejson: "Couldn't find a package.json file in $0",
  couldntFindMatch: "Couldn't find match for $0 in $1 for $2.",
  couldntFindPackageInCache:
    "Couldn't find any versions for $0 that matches $1 in our cache (possible versions are $2). This is usually caused by a missing entry in the lockfile, running Yarn without the --offline flag may help fix this issue.",
  couldntFindVersionThatMatchesRange: "Couldn't find any versions for $0 that matches $1",
  chooseVersionFromList: 'Please choose a version of $0 from this list:',
  moduleNotInManifest: "This module isn't specified in a package.json file.",
  moduleAlreadyInManifest: '$0 is already in $1. Please remove existing entry first before adding it to $2.',
  unknownFolderOrTarball: "Passed folder/tarball doesn't exist,",
  unknownPackage: "Couldn't find package $0.",
  unknownPackageName: "Couldn't find package name.",
  unknownUser: "Couldn't find user $0.",
  unknownRegistryResolver: 'Unknown registry resolver $0',
  userNotAnOwner: "User $0 isn't an owner of this package.",
  invalidVersionArgument: 'Use the $0 flag to create a new version.',
  invalidVersion: 'Invalid version supplied.',
  requiredVersionInRange: 'Required version in range.',
  packageNotFoundRegistry: "Couldn't find package $0 on the $1 registry.",
  requiredPackageNotFoundRegistry: "Couldn't find package $0 required by $1 on the $2 registry.",
  doesntExist: "Package $1 refers to a non-existing file '$0'.",
  missingRequiredPackageKey: "Package $0 doesn't have a $1.",
  invalidAccess: 'Invalid argument for access, expected public or restricted.',
  invalidCommand: 'Invalid subcommand. Try $0',
  invalidGistFragment: 'Invalid gist fragment $0.',
  invalidHostedGitFragment: 'Invalid hosted git fragment $0.',
  invalidFragment: 'Invalid fragment $0.',
  invalidPackageName: 'Invalid package name.',
  invalidPackageVersion: "Can't add $0: invalid package version $1.",
  couldntFindManifestIn: "Couldn't find manifest in $0.",
  shrinkwrapWarning:
    'npm-shrinkwrap.json found. This will not be updated or respected. See https://yarnpkg.com/en/docs/migrating-from-npm for more information.',
  npmLockfileWarning:
    'package-lock.json found. Your project contains lock files generated by tools other than Yarn. It is advised not to mix package managers in order to avoid resolution inconsistencies caused by unsynchronized lock files. To clear this warning, remove package-lock.json.',
  lockfileOutdated: 'Outdated lockfile. Please run `yarn install` and try again.',
  lockfileMerged: 'Merge conflict detected in yarn.lock and successfully merged.',
  lockfileConflict:
    'A merge conflict was found in yarn.lock but it could not be successfully merged, regenerating yarn.lock from scratch.',
  ignoredScripts: 'Ignored scripts due to flag.',
  missingAddDependencies: 'Missing list of packages to add to your project.',
  yesWarning:
    'The yes flag has been set. This will automatically answer yes to all questions, which may have security implications.',
  networkWarning:
    "You don't appear to have an internet connection. Try the --offline flag to use the cache for registry queries.",
  flatGlobalError:
    'The package $0 requires a flat dependency graph. Add `"flat": true` to your package.json and try again.',
  noName: "Package doesn't have a name.",
  noVersion: "Package doesn't have a version.",
  answerRequired: 'An answer is required.',
  missingWhyDependency: 'Missing package name, folder or path to file to identify why a package has been installed',
  bugReport: 'If you think this is a bug, please open a bug report with the information provided in $0.',
  unexpectedError: 'An unexpected error occurred: $0.',
  jsonError: 'Error parsing JSON at $0, $1.',
  noPermission: 'Cannot create $0 due to insufficient permissions.',
  noGlobalFolder: 'Cannot find a suitable global folder. Tried these: $0',
  allDependenciesUpToDate: 'All of your dependencies are up to date.',
  legendColorsForVersionUpdates:
    'Color legend : \n $0    : Major Update backward-incompatible updates \n $1 : Minor Update backward-compatible features \n $2  : Patch Update backward-compatible bug fixes',
  frozenLockfileError: 'Your lockfile needs to be updated, but yarn was run with `--frozen-lockfile`.',
  fileWriteError: 'Could not write file $0: $1',
  multiplePackagesCantUnpackInSameDestination:
    'Pattern $0 is trying to unpack in the same destination $1 as pattern $2. This could result in non-deterministic behavior, skipping.',
  incorrectLockfileEntry: 'Lockfile has incorrect entry for $0. Ignoring it.',

  invalidResolutionName: 'Resolution field $0 does not end with a valid package name and will be ignored',
  invalidResolutionVersion: 'Resolution field $0 has an invalid version entry and may be ignored',
  incompatibleResolutionVersion: 'Resolution field $0 is incompatible with requested version $1',

  yarnOutdated: "Your current version of Yarn is out of date. The latest version is $0, while you're on $1.",
  yarnOutdatedInstaller: 'To upgrade, download the latest installer at $0.',
  yarnOutdatedCommand: 'To upgrade, run the following command:',

  tooManyArguments: 'Too many arguments, maximum of $0.',
  tooFewArguments: 'Not enough arguments, expected at least $0.',
  noArguments: "This command doesn't require any arguments.",

  ownerRemoving: 'Removing owner $0 from package $1.',
  ownerRemoved: 'Owner removed.',
  ownerRemoveError: "Couldn't remove owner.",
  ownerGetting: 'Getting owners for package $0',
  ownerGettingFailed: "Couldn't get list of owners.",
  ownerAlready: 'This user is already an owner of this package.',
  ownerAdded: 'Added owner.',
  ownerAdding: 'Adding owner $0 to package $1',
  ownerAddingFailed: "Couldn't add owner.",
  ownerNone: 'No owners.',

  teamCreating: 'Creating team',
  teamRemoving: 'Removing team',
  teamAddingUser: 'Adding user to team',
  teamRemovingUser: 'Removing user from team',
  teamListing: 'Listing teams',

  cleaning: 'Cleaning modules',
  cleanCreatingFile: 'Creating $0',
  cleanCreatedFile:
    'Created $0. Please review the contents of this file then run "yarn autoclean --force" to perform a clean.',
  cleanAlreadyExists: '$0 already exists. To revert to the default file, delete $0 then rerun this command.',
  cleanRequiresForce:
    'This command required the "--force" flag to perform the clean. This is a destructive operation. Files specified in $0 will be deleted.',
  cleanDoesNotExist:
    '$0 does not exist. Autoclean will delete files specified by $0. Run "autoclean --init" to create $0 with the default entries.',

  binLinkCollision:
    "There's already a linked binary called $0 in your global Yarn bin. Could not link this package's $0 bin entry.",
  linkCollision:
    "There's already a package called $0 registered. This command has had no effect. If this command was run in another folder with the same name, the other folder is still linked. Please run yarn unlink in the other folder if you want to register this folder.",
  linkMissing: 'No registered package found called $0.',
  linkRegistered: 'Registered $0.',
  linkRegisteredMessage:
    'You can now run `yarn link $0` in the projects where you want to use this package and it will be used instead.',
  linkUnregistered: 'Unregistered $0.',
  linkUnregisteredMessage:
    'You can now run `yarn unlink $0` in the projects where you no longer want to use this package.',
  linkUsing: 'Using linked package for $0.',
  linkDisusing: 'Removed linked package $0.',
  linkDisusingMessage: 'You will need to run `yarn install --force` to re-install the package that was linked.',
  linkTargetMissing: 'The target of linked package $0 is missing. Removing link.',

  createInvalidBin: 'Invalid bin entry found in package $0.',
  createMissingPackage:
    'Package not found - this is probably an internal error, and should be reported at https://github.com/yarnpkg/yarn/issues.',

  workspacesAddRootCheck:
    'Running this command will add the dependency to the workspace root rather than the workspace itself, which might not be what you want - if you really meant it, make it explicit by running this command again with the -W flag (or --ignore-workspace-root-check).',
  workspacesRemoveRootCheck:
    'Running this command will remove the dependency from the workspace root rather than the workspace itself, which might not be what you want - if you really meant it, make it explicit by running this command again with the -W flag (or --ignore-workspace-root-check).',
  workspacesFocusRootCheck: 'This command can only be run inside an individual workspace.',
  workspacesRequirePrivateProjects: 'Workspaces can only be enabled in private projects.',
  workspacesSettingMustBeArray: 'The workspaces field in package.json must be an array.',
  workspacesDisabled:
    'Your project root defines workspaces but the feature is disabled in your Yarn config. Please check "workspaces-experimental" in your .yarnrc file.',

  workspacesNohoistRequirePrivatePackages:
    'nohoist config is ignored in $0 because it is not a private package. If you think nohoist should be allowed in public packages, please submit an issue for your use case.',
  workspacesNohoistDisabled:
    '$0 defines nohoist but the feature is disabled in your Yarn config ("workspaces-nohoist-experimental" in .yarnrc file)',

  workspaceRootNotFound: "Cannot find the root of your workspace - are you sure you're currently in a workspace?",
  workspaceMissingWorkspace: 'Missing workspace name.',
  workspaceMissingCommand: 'Missing command name.',
  workspaceUnknownWorkspace: 'Unknown workspace $0.',
  workspaceVersionMandatory: 'Missing version in workspace at $0, ignoring.',
  workspaceNameMandatory: 'Missing name in workspace at $0, ignoring.',
  workspaceNameDuplicate: 'There are more than one workspace with name $0',

  cacheFolderSkipped: 'Skipping preferred cache folder $0 because it is not writable.',
  cacheFolderMissing:
    "Yarn hasn't been able to find a cache folder it can use. Please use the explicit --cache-folder option to tell it what location to use, or make one of the preferred locations writable.",
  cacheFolderSelected: 'Selected the next writable cache folder in the list, will be $0.',

  execMissingCommand: 'Missing command name.',

  noScriptsAvailable: 'There are no scripts specified inside package.json.',
  noBinAvailable: 'There are no binary scripts available.',
  dashDashDeprecation:
    'From Yarn 1.0 onwards, scripts don\'t require "--" for options to be forwarded. In a future version, any explicit "--" will be forwarded as-is to the scripts.',
  commandNotSpecified: 'No command specified.',
  binCommands: 'Commands available from binary scripts: ',
  possibleCommands: 'Project commands',
  commandQuestion: 'Which command would you like to run?',
  commandFailedWithCode: 'Command failed with exit code $0.',
  commandFailedWithSignal: 'Command failed with signal $0.',
  packageRequiresNodeGyp:
    'This package requires node-gyp, which is not currently installed. Yarn will attempt to automatically install it. If this fails, you can run "yarn global add node-gyp" to manually install it.',
  nodeGypAutoInstallFailed:
    'Failed to auto-install node-gyp. Please run "yarn global add node-gyp" manually. Error: $0',

  foundIncompatible: 'Found incompatible module.',
  incompatibleEngine: 'The engine $0 is incompatible with this module. Expected version $1. Got $2',
  incompatibleCPU: 'The CPU architecture $0 is incompatible with this module.',
  incompatibleOS: 'The platform $0 is incompatible with this module.',
  invalidEngine: 'The engine $0 appears to be invalid.',
  cannotRunWithIncompatibleEnv: 'Commands cannot run with an incompatible environment.',

  optionalCompatibilityExcluded:
    '$0 is an optional dependency and failed compatibility check. Excluding it from installation.',
  optionalModuleFail: 'This module is OPTIONAL, you can safely ignore this error',
  optionalModuleScriptFail: 'Error running install script for optional dependency: $0',
  optionalModuleCleanupFail: 'Could not cleanup build artifacts from failed install: $0',

  unmetPeer: '$0 has unmet peer dependency $1.',
  incorrectPeer: '$0 has incorrect peer dependency $1.',
  selectedPeer: 'Selecting $1 at level $2 as the peer dependency of $0.',
  missingBundledDependency: '$0 is missing a bundled dependency $1. This should be reported to the package maintainer.',

  savedNewDependency: 'Saved 1 new dependency.',
  savedNewDependencies: 'Saved $0 new dependencies.',
  directDependencies: 'Direct dependencies',
  allDependencies: 'All dependencies',

  foundWarnings: 'Found $0 warnings.',
  foundErrors: 'Found $0 errors.',

  savedLockfile: 'Saved lockfile.',
  noRequiredLockfile: 'No lockfile in this directory. Run `yarn install` to generate one.',
  noLockfileFound: 'No lockfile found.',

  invalidSemver: 'Invalid semver version',
  newVersion: 'New version',
  currentVersion: 'Current version',
  noVersionOnPublish: 'Proceeding with current version',

  manualVersionResolution:
    'Unable to find a suitable version for $0, please choose one by typing one of the numbers below:',
  manualVersionResolutionOption: '$0 which resolved to $1',

  createdTag: 'Created tag.',
  createdTagFail: "Couldn't add tag.",
  deletedTag: 'Deleted tag.',
  deletedTagFail: "Couldn't delete tag.",
  gettingTags: 'Getting tags',
  deletingTags: 'Deleting tag',
  creatingTag: 'Creating tag $0 = $1',

  whyStart: 'Why do we have the module $0?',
  whyFinding: 'Finding dependency',
  whyCalculating: 'Calculating file sizes',
  whyUnknownMatch: "We couldn't find a match!",
  whyInitGraph: 'Initialising dependency graph',
  whyWhoKnows: "We don't know why this module exists",
  whyDiskSizeWithout: 'Disk size without dependencies: $0',
  whyDiskSizeUnique: 'Disk size with unique dependencies: $0',
  whyDiskSizeTransitive: 'Disk size with transitive dependencies: $0',
  whySharedDependencies: 'Number of shared dependencies: $0',
  whyHoistedTo: 'Has been hoisted to $0',

  whyHoistedFromSimple: "This module exists because it's hoisted from $0.",
  whyNotHoistedSimple: "This module exists here because it's in the nohoist list $0.",
  whyDependedOnSimple: 'This module exists because $0 depends on it.',
  whySpecifiedSimple: "This module exists because it's specified in $0.",
  whyReasons: 'Reasons this module exists',
  whyHoistedFrom: 'Hoisted from $0',
  whyNotHoisted: 'in the nohoist list $0',
  whyDependedOn: '$0 depends on it',
  whySpecified: 'Specified in $0',

  whyMatch: '\r=> Found $0',

  uninstalledPackages: 'Uninstalled packages.',
  uninstallRegenerate: 'Regenerating lockfile and installing missing dependencies',

  cleanRemovedFiles: 'Removed $0 files',
  cleanSavedSize: 'Saved $0 MB.',

  configFileFound: 'Found configuration file $0.',
  configPossibleFile: 'Checking for configuration file $0.',

  npmUsername: 'npm username',
  npmPassword: 'npm password',
  npmEmail: 'npm email',
  npmOneTimePassword: 'npm one-time password',

  loggingIn: 'Logging in',
  loggedIn: 'Logged in.',
  notRevokingEnvToken: 'Not revoking login token, specified via environment variable.',
  notRevokingConfigToken: 'Not revoking login token, specified via config file.',
  noTokenToRevoke: 'No login token to revoke.',
  revokingToken: 'Revoking token',
  revokedToken: 'Revoked login token.',

  loginAsPublic: 'Logging in as public',
  incorrectCredentials: 'Incorrect username or password.',
  incorrectOneTimePassword: 'Incorrect one-time password.',
  twoFactorAuthenticationEnabled: 'Two factor authentication enabled.',
  clearedCredentials: 'Cleared login credentials.',

  publishFail: "Couldn't publish package: $0",
  publishPrivate: 'Package marked as private, not publishing.',
  published: 'Published.',
  publishing: 'Publishing',

  nonInteractiveNoVersionSpecified:
    'You must specify a new version with --new-version when running with --non-interactive.',
  nonInteractiveNoToken: "No token found and can't prompt for login when running with --non-interactive.",

  infoFail: 'Received invalid response from npm.',
  malformedRegistryResponse: 'Received malformed response from registry for $0. The registry may be down.',
  registryNoVersions: 'No valid versions found for $0. The package may be unpublished.',

  cantRequestOffline: "Can't make a request in offline mode ($0)",
  requestManagerNotSetupHAR: 'RequestManager was not setup to capture HAR files',
  requestError: 'Request $0 returned a $1',
  requestFailed: 'Request failed $0',
  tarballNotInNetworkOrCache: '$0: Tarball is not in network and can not be located in cache ($1)',
  fetchBadIntegrityCache:
    'Incorrect integrity when fetching from the cache for $0. Cache has $1 and remote has $2. Run `yarn cache clean` to fix the problem',
  fetchBadHashCache:
    'Incorrect hash when fetching from the cache for $0. Cache has $1 and remote has $2. Run `yarn cache clean` to fix the problem',
  fetchBadHashWithPath: "Integrity check failed for $0 (computed integrity doesn't match our records, got $2)",
  fetchBadIntegrityAlgorithm: 'Integrity checked failed for $0 (none of the specified algorithms are supported)',
  fetchErrorCorrupt:
    '$0. Mirror tarball appears to be corrupt. You can resolve this by running:\n\n  rm -rf $1\n  yarn install',
  errorExtractingTarball: 'Extracting tar content of $1 failed, the file appears to be corrupt: $0',
  updateInstalling: 'Installing $0...',
  hostedGitResolveError: 'Error connecting to repository. Please, check the url.',
  unauthorizedResponse: 'Received a 401 from $0. $1',

  unknownFetcherFor: 'Unknown fetcher for $0',

  downloadGitWithoutCommit: 'Downloading the git repo $0 over plain git without a commit hash',
  downloadHTTPWithoutCommit: 'Downloading the git repo $0 over HTTP without a commit hash',

  unplugDisabled: "Packages can only be unplugged when Plug'n'Play is enabled.",

  plugnplaySuggestV2L1: "Plug'n'Play support has been greatly improved on the Yarn v2 development branch.",
  plugnplaySuggestV2L2:
    'Please give it a try and tell us what you think! - https://next.yarnpkg.com/getting-started/install',
  plugnplayWindowsSupport: "Plug'n'Play on Windows doesn't support the cache and project to be kept on separate drives",

  packageInstalledWithBinaries: 'Installed $0 with binaries:',
  packageHasBinaries: '$0 has binaries:',
  packageHasNoBinaries: '$0 has no binaries',
  packageBinaryNotFound: "Couldn't find a binary named $0",

  couldBeDeduped: '$0 could be deduped from $1 to $2',
  lockfileNotContainPattern: 'Lockfile does not contain pattern: $0',
  integrityCheckFailed: 'Integrity check failed',
  noIntegrityFile: "Couldn't find an integrity file",
  integrityFailedExpectedIsNotAJSON: 'Integrity check: integrity file is not a json',
  integrityCheckLinkedModulesDontMatch: "Integrity check: Linked modules don't match",
  integrityFlagsDontMatch: "Integrity check: Flags don't match",
  integrityLockfilesDontMatch: "Integrity check: Lock files don't match",
  integrityFailedFilesMissing: 'Integrity check: Files are missing',
  integrityPatternsDontMatch: "Integrity check: Top level patterns don't match",
  integrityModulesFoldersMissing: 'Integrity check: Some module folders are missing',
  integritySystemParamsDontMatch: "Integrity check: System parameters don't match",
  packageNotInstalled: '$0 not installed',
  optionalDepNotInstalled: 'Optional dependency $0 not installed',
  packageWrongVersion: '$0 is wrong version: expected $1, got $2',
  packageDontSatisfy: "$0 doesn't satisfy found match of $1",

  lockfileExists: 'Lockfile already exists, not importing.',
  skippingImport: 'Skipping import of $0 for $1',
  importFailed: 'Import of $0 for $1 failed, resolving normally.',
  importResolveFailed: 'Import of $0 failed starting in $1',
  importResolvedRangeMatch: 'Using version $0 of $1 instead of $2 for $3',
  importSourceFilesCorrupted: 'Failed to import from package-lock.json, source file(s) corrupted',
  importPackageLock: 'found npm package-lock.json, converting to yarn.lock',
  importNodeModules: 'creating yarn.lock from local node_modules folder',
  packageContainsYarnAsGlobal:
    'Installing Yarn via Yarn will result in you having two separate versions of Yarn installed at the same time, which is not recommended. To update Yarn please follow https://yarnpkg.com/en/docs/install .',

  scopeNotValid: 'The specified scope is not valid.',

  deprecatedCommand: '$0 is deprecated. Please use $1.',
  deprecatedListArgs: 'Filtering by arguments is deprecated. Please use the pattern option instead.',
  implicitFileDeprecated:
    'Using the "file:" protocol implicitly is deprecated. Please either prepend the protocol or prepend the path $0 with "./".',
  unsupportedNodeVersion:
    'You are using Node $0 which is not supported and may encounter bugs or unexpected behavior. Yarn supports the following semver range: $1',

  verboseUpgradeBecauseRequested: 'Considering upgrade of $0 to $1 because it was directly requested.',
  verboseUpgradeBecauseOutdated: 'Considering upgrade of $0 to $1 because a newer version exists in the registry.',
  verboseUpgradeNotUnlocking: 'Not unlocking $0 in the lockfile because it is a new or direct dependency.',
  verboseUpgradeUnlocking: 'Unlocking $0 in the lockfile.',
  folderMissing: "Directory $0 doesn't exist",
  mutexPortBusy: 'Cannot use the network mutex on port $0. It is probably used by another app.',

  auditRunning: 'Auditing packages',
  auditSummary: '$0 vulnerabilities found - Packages audited: $1',
  auditSummarySeverity: 'Severity:',
  auditCritical: '$0 Critical',
  auditHigh: '$0 High',
  auditModerate: '$0 Moderate',
  auditLow: '$0 Low',
  auditInfo: '$0 Info',
  auditResolveCommand: '# Run $0 to resolve $1 $2',
  auditSemverMajorChange: 'SEMVER WARNING: Recommended action is a potentially breaking change',
  auditManualReview:
    'Manual Review\nSome vulnerabilities require your attention to resolve\n\nVisit https://go.npm.me/audit-guide for additional guidance',
  auditRunAuditForDetails: 'Security audit found potential problems. Run "yarn audit" for additional details.',
  auditOffline: 'Skipping audit. Security audit cannot be performed in offline mode.',
};

var languages = {
  __proto__: null,
  en: messages,
};

var isCI = _libs['ci-info'].isCI;

function stringifyLangArgs(args) {
  return args.map(function(val) {
    if (val != null && val.inspect) return val.inspect();

    try {
      return (JSON.stringify(val) || val + '')
        .replace(/((?:^|[^\\])(?:\\{2})*)\\u001[bB]/g, '$1\x1b')
        .replace(/[\\]r[\\]n|([\\])?[\\]n/g, (match, precededBacklash) => (precededBacklash ? match : os.EOL));
    } catch (_e) {
      return util.inspect(val);
    }
  });
}

class BaseReporter {
  constructor(opts = {}) {
    const lang = 'en';
    this.language = lang;

    this.stdout = opts.stdout || process.stdout;
    this.stderr = opts.stderr || process.stderr;
    this.stdin = opts.stdin || this._getStandardInput();
    this.emoji = !!opts.emoji;
    this.nonInteractive = !!opts.nonInteractive;
    this.noProgress = !!opts.noProgress || isCI;
    this.isVerbose = !!opts.verbose;

    this.isTTY = this.stdout.isTTY;

    this.peakMemory = 0;
    this.startTime = Date.now();
    this.format = defaultFormatter;
  }

  lang(key, ...args) {
    const msg = languages[this.language][key] || messages[key];
    if (!msg) throw new ReferenceError('No message defined for language key ' + key);

    const stringifiedArgs = stringifyLangArgs(args);

    return msg.replace(/\$(\d+)/g, (str, i) => stringifiedArgs[i]);
  }

  rawText(str) {
    return {inspect: () => str};
  }

  verbose(msg) {
    this.isVerbose && this._verbose(msg);
  }

  verboseInspect(val) {
    this.isVerbose && this._verboseInspect(val);
  }

  _verbose(msg) {}
  _verboseInspect(val) {}

  _getStandardInput() {
    let standardInput;

    try {
      standardInput = process.stdin;
    } catch (e) {
      console.warn(e.message);
      delete process.stdin;
      process.stdin = new events.EventEmitter();
      standardInput = process.stdin;
    }

    return standardInput;
  }

  initPeakMemoryCounter() {
    this.checkPeakMemory();
    this.peakMemoryInterval = setInterval(() => {
      this.checkPeakMemory();
    }, 1000);
    this.peakMemoryInterval.unref();
  }

  checkPeakMemory() {
    const {heapTotal} = process.memoryUsage();
    if (heapTotal > this.peakMemory) this.peakMemory = heapTotal;
  }

  close() {
    if (this.peakMemoryInterval) {
      clearInterval(this.peakMemoryInterval);
      this.peakMemoryInterval = null;
    }
  }

  getTotalTime() {
    return Date.now() - this.startTime;
  }

  list(key, items, hints) {}

  tree(key, obj, {force = false} = {}) {}

  step(current, total, message, emoji) {}

  error(message) {}
  info(message) {}
  warn(message) {}
  success(message) {}

  log(message, {force = false} = {}) {}

  command(command) {}

  inspect(value) {}

  header(command, pkg) {}
  footer(showPeakMemory) {}

  table(head, body) {}

  auditAction(recommendation) {}
  auditManualReview() {}
  auditAdvisory(resolution, auditAdvisory) {}
  auditSummary(auditMetadata) {}

  activity() {
    return {tick(name) {}, end() {}};
  }

  activitySet(total, workers) {
    return {
      spinners: Array(workers).fill({clear() {}, setPrefix() {}, tick() {}, end() {}}),
      end() {},
    };
  }

  question(question, options = {}) {
    return Promise.reject(new Error('Not implemented'));
  }

  async questionAffirm(question) {
    const condition = true;
    if (this.nonInteractive) return true;

    while (condition) {
      let answer = await this.question(question);
      answer = answer.toLowerCase();

      if (answer === 'y' || answer === 'yes') return true;
      if (answer === 'n' || answer === 'no') return false;

      this.error('Invalid answer for question');
    }

    return false;
  }

  select(header, question, options) {
    return Promise.reject(new Error('Not implemented'));
  }

  progress(total) {
    return function() {};
  }

  disableProgress() {
    this.noProgress = true;
  }

  prompt(message, choices, options = {}) {
    return Promise.reject(new Error('Not implemented'));
  }
}

const CLEAR_WHOLE_LINE = 0,
  CLEAR_RIGHT_OF_CURSOR = 1;

function clearLine(stdout) {
  if (chalk.supportsColor) {
    readline.clearLine(stdout, CLEAR_WHOLE_LINE);
    readline.cursorTo(stdout, 0);
  } else if (stdout instanceof tty.WriteStream) {
    stdout.columns > 0 && stdout.write('\r' + ' '.repeat(stdout.columns - 1));

    stdout.write('\r');
  }
}

function toStartOfLine(stdout) {
  chalk.supportsColor ? readline.cursorTo(stdout, 0) : stdout.write('\r');
}

function writeOnNthLine(stdout, n, msg) {
  if (!chalk.supportsColor) return;

  if (n == 0) {
    readline.cursorTo(stdout, 0);
    stdout.write(msg);
    readline.clearLine(stdout, CLEAR_RIGHT_OF_CURSOR);
    return;
  }
  readline.cursorTo(stdout, 0);
  readline.moveCursor(stdout, 0, -n);
  stdout.write(msg);
  readline.clearLine(stdout, CLEAR_RIGHT_OF_CURSOR);
  readline.cursorTo(stdout, 0);
  readline.moveCursor(stdout, 0, n);
}

function clearNthLine(stdout, n) {
  if (!chalk.supportsColor) return;

  if (n == 0) {
    clearLine(stdout);
    return;
  }
  readline.cursorTo(stdout, 0);
  readline.moveCursor(stdout, 0, -n);
  readline.clearLine(stdout, CLEAR_WHOLE_LINE);
  readline.moveCursor(stdout, 0, n);
}

class ProgressBar {
  constructor(total, stdout = process.stderr, callback) {
    this.stdout = stdout;
    this.total = total;
    this.chars = ProgressBar.bars[0];
    this.delay = 60;
    this.curr = 0;
    this._callback = callback;
    clearLine(stdout);
  }

  static bars = [['#', '-']];

  tick() {
    if (this.curr >= this.total) return;

    this.curr++;

    this.id || (this.id = setTimeout(() => this.render(), this.delay));
  }

  cancelTick() {
    if (this.id) {
      clearTimeout(this.id);
      this.id = null;
    }
  }

  stop() {
    this.curr = this.total;

    this.cancelTick();
    clearLine(this.stdout);
    this._callback && this._callback(this);
  }

  render() {
    this.cancelTick();

    let ratio = this.curr / this.total;
    ratio = Math.min(Math.max(ratio, 0), 1);

    let bar = ` ${this.curr}/${this.total}`;

    const availableSpace = Math.max(0, this.stdout.columns - bar.length - 3),
      width = Math.min(this.total, availableSpace),
      completeLength = Math.round(width * ratio);
    bar = `[${this.chars[0].repeat(completeLength)}${this.chars[1].repeat(width - completeLength)}]${bar}`;

    toStartOfLine(this.stdout);
    this.stdout.write(bar);
  }
}

class Spinner {
  constructor(stdout = process.stderr, lineNumber = 0) {
    this.current = 0;
    this.prefix = '';
    this.lineNumber = lineNumber;
    this.stdout = stdout;
    this.delay = 60;
    this.chars = Spinner.spinners[28].split('');
    this.text = '';
    this.id = null;
  }

  static spinners = [
    '|/-\\',
    '⠂-–—–-',
    '◐◓◑◒',
    '◴◷◶◵',
    '◰◳◲◱',
    '▖▘▝▗',
    '■□▪▫',
    '▌▀▐▄',
    '▉▊▋▌▍▎▏▎▍▌▋▊▉',
    '▁▃▄▅▆▇█▇▆▅▄▃',
    '←↖↑↗→↘↓↙',
    '┤┘┴└├┌┬┐',
    '◢◣◤◥',
    '.oO°Oo.',
    '.oO@*',
    '🌍🌎🌏',
    '◡◡ ⊙⊙ ◠◠',
    '☱☲☴',
    '⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏',
    '⠋⠙⠚⠞⠖⠦⠴⠲⠳⠓',
    '⠄⠆⠇⠋⠙⠸⠰⠠⠰⠸⠙⠋⠇⠆',
    '⠋⠙⠚⠒⠂⠂⠒⠲⠴⠦⠖⠒⠐⠐⠒⠓⠋',
    '⠁⠉⠙⠚⠒⠂⠂⠒⠲⠴⠤⠄⠄⠤⠴⠲⠒⠂⠂⠒⠚⠙⠉⠁',
    '⠈⠉⠋⠓⠒⠐⠐⠒⠖⠦⠤⠠⠠⠤⠦⠖⠒⠐⠐⠒⠓⠋⠉⠈',
    '⠁⠁⠉⠙⠚⠒⠂⠂⠒⠲⠴⠤⠄⠄⠤⠠⠠⠤⠦⠖⠒⠐⠐⠒⠓⠋⠉⠈⠈',
    '⢄⢂⢁⡁⡈⡐⡠',
    '⢹⢺⢼⣸⣇⡧⡗⡏',
    '⣾⣽⣻⢿⡿⣟⣯⣷',
    '⠁⠂⠄⡀⢀⠠⠐⠈',
  ];
  setPrefix(prefix) {
    this.prefix = prefix;
  }
  setText(text) {
    this.text = text;
  }
  start() {
    this.current = 0;
    this.render();
  }
  render() {
    this.id && clearTimeout(this.id);

    let msg = `${this.prefix}${this.chars[this.current]} ${this.text}`;
    const columns = typeof this.stdout.columns == 'number' ? this.stdout.columns : 100;
    msg = msg.slice(0, columns);
    writeOnNthLine(this.stdout, this.lineNumber, msg);
    this.current = ++this.current % this.chars.length;
    this.id = setTimeout(() => this.render(), this.delay);
  }
  stop() {
    if (this.id) {
      clearTimeout(this.id);
      this.id = null;
    }
    clearNthLine(this.stdout, this.lineNumber);
  }
}

function sortAlpha(a, b) {
  const shortLen = Math.min(a.length, b.length);
  for (let i = 0; i < shortLen; i++) {
    const aChar = a.charCodeAt(i),
      bChar = b.charCodeAt(i);
    if (aChar !== bChar) return aChar - bChar;
  }
  return a.length - b.length;
}

function sortOptionsByFlags(a, b) {
  return sortAlpha(a.flags.replace(/-/g, ''), b.flags.replace(/-/g, ''));
}

function entries(obj) {
  const entries = [];
  if (obj) for (const key in obj) entries.push([key, obj[key]]);

  return entries;
}

function removePrefix(pattern, prefix) {
  if (pattern.startsWith(prefix)) pattern = pattern.slice(prefix.length);

  return pattern;
}

function removeSuffix(pattern, suffix) {
  return pattern.endsWith(suffix) ? pattern.slice(0, -suffix.length) : pattern;
}

function addSuffix(pattern, suffix) {
  return pattern.endsWith(suffix) ? pattern : pattern + suffix;
}

function hyphenate(str) {
  return str.replace(/[A-Z]/g, match => '-' + match.toLowerCase());
}

function camelCase(str) {
  return /[A-Z]/.test(str) ? null : _camelCase(str);
}

function compareSortedArrays(array1, array2) {
  if (array1.length !== array2.length) return false;

  for (let i = 0, len = array1.length; i < len; i++) if (array1[i] !== array2[i]) return false;

  return true;
}

function sortTrees(trees) {
  return trees.sort(function(tree1, tree2) {
    return tree1.name.localeCompare(tree2.name);
  });
}

function recurseTree(tree, prefix, recurseFunc) {
  const treeLen = tree.length,
    treeEnd = treeLen - 1;
  for (let i = 0; i < treeLen; i++) {
    const atEnd = i === treeEnd;
    recurseFunc(tree[i], prefix + getLastIndentChar(atEnd), prefix + getNextIndentChar(atEnd));
  }
}

function getFormattedOutput(fmt) {
  const item = formatColor(fmt.color, fmt.name, fmt.formatter),
    suffix = getSuffix(fmt.hint, fmt.formatter);
  return `${fmt.prefix}─ ${item}${suffix}\n`;
}

function getNextIndentChar(end) {
  return end ? '   ' : '│  ';
}

function getLastIndentChar(end) {
  return end ? '└' : '├';
}

function getSuffix(hint, formatter) {
  return hint ? ` (${formatter.grey(hint)})` : '';
}

function formatColor(color, strToFormat, formatter) {
  return color ? formatter[color](strToFormat) : strToFormat;
}

const AUDIT_COL_WIDTHS = [15, 62];

const auditSeverityColors = {
  info: chalk.bold,
  low: chalk.bold,
  moderate: chalk.yellow,
  high: chalk.red,
  critical: chalk.bgRed,
};

process.platform !== 'win32' || (process.env.TERM && /^xterm/i.test(process.env.TERM)) ||
  (chalk.bold._styles[0].close += '\x1b[m');

class ConsoleReporter extends BaseReporter {
  constructor(opts) {
    super(opts);

    this._lastCategorySize = 0;
    this._spinners = new Set();
    this.format = chalk;
    this.format.stripColor = stripAnsi;
    this.isSilent = !!opts.isSilent;
  }

  _prependEmoji(msg, emoji) {
    if (this.emoji && emoji && this.isTTY) msg = `${emoji}  ${msg}`;

    return msg;
  }

  _logCategory(category, color, msg) {
    this._lastCategorySize = category.length;
    this._log(`${this.format[color](category)} ${msg}`);
  }

  _verbose(msg) {
    this._logCategory('verbose', 'grey', `${process.uptime()} ${msg}`);
  }

  _verboseInspect(obj) {
    this.inspect(obj);
  }

  close() {
    for (const spinner of this._spinners) spinner.stop();

    this._spinners.clear();
    this.stopProgress();
    super.close();
  }

  table(head, body) {
    const rows = [(head = head.map((field) => this.format.underline(field)))].concat(body),

      cols = [];
    for (let i = 0; i < head.length; i++) {
      const widths = rows.map((row) => this.format.stripColor(row[i]).length);
      cols[i] = Math.max(...widths);
    }

    const builtRows = rows.map((row) => {
      for (let i = 0; i < row.length; i++) {
        const field = row[i],
          padding = cols[i] - this.format.stripColor(field).length;

        row[i] = field + ' '.repeat(padding);
      }
      return row.join(' ');
    });

    this.log(builtRows.join('\n'));
  }

  step(current, total, msg, emoji) {
    (msg = this._prependEmoji(msg, emoji)).endsWith('?') ? (msg = removeSuffix(msg, '?') + '...?') : (msg += '...');

    this.log(`${this.format.dim(`[${current}/${total}]`)} ${msg}`);
  }

  inspect(value) {
    if (typeof value != 'number' && typeof value != 'string')
      value = util.inspect(value, {breakLength: 0, colors: this.isTTY, depth: null, maxArrayLength: null});

    this.log(String(value), {force: true});
  }

  list(key, items, hints) {
    const gutterWidth = (this._lastCategorySize || 2) - 1;

    if (hints)
      for (const item of items) {
        this._log(`${' '.repeat(gutterWidth)}- ${this.format.bold(item)}`);
        this._log(`  ${' '.repeat(gutterWidth)} ${hints[item]}`);
      }
    else for (const item of items) this._log(`${' '.repeat(gutterWidth)}- ${item}`);
  }

  header(command, pkg) {
    this.log(this.format.bold(`${pkg.name} ${command} v${pkg.version}`));
  }

  footer(showPeakMemory) {
    this.stopProgress();

    let msg = `Done in ${(this.getTotalTime() / 1000).toFixed(2)}s.`;
    if (showPeakMemory) msg += ` Peak memory usage ${(this.peakMemory / 1024 / 1024).toFixed(2)}MB.`;

    this.log(this._prependEmoji(msg, '✨'));
  }

  log(msg, {force = false} = {}) {
    this._lastCategorySize = 0;
    this._log(msg, {force});
  }

  _log(msg, {force = false} = {}) {
    if (this.isSilent && !force) return;

    clearLine(this.stdout);
    this.stdout.write(msg + '\n');
  }

  success(msg) {
    this._logCategory('success', 'green', msg);
  }

  error(msg) {
    clearLine(this.stderr);
    this.stderr.write(`${this.format.red('error')} ${msg}\n`);
  }

  info(msg) {
    this._logCategory('info', 'blue', msg);
  }

  command(command) {
    this.log(this.format.dim('$ ' + command));
  }

  warn(msg) {
    clearLine(this.stderr);
    this.stderr.write(`${this.format.yellow('warning')} ${msg}\n`);
  }

  question(question, options = {}) {
    if (!process.stdout.isTTY) return Promise.reject(new Error("Can't answer a question unless a user TTY"));

    return new Promise((resolve, reject) => {
      read(
        {
          prompt: `${this.format.dim('question')} ${question}: `,
          silent: !!options.password,
          output: this.stdout,
          input: this.stdin,
        },
        (err, answer) => {
          if (err) {
            if (err.message === 'canceled') process.exitCode = 1;
            reject(err);
          } else if (!answer && options.required) {
            this.error(this.lang('answerRequired'));
            resolve(this.question(question, options));
          } else resolve(answer);
        }
      );
    });
  }
  tree(key, trees, {force = false} = {}) {
    this.stopProgress();
    if (this.isSilent && !force) return;

    const output = ({name, children, hint, color}, titlePrefix, childrenPrefix) => {
      const out = getFormattedOutput({prefix: titlePrefix, hint, color, name, formatter: this.format});
      this.stdout.write(out);

      children && children.length && recurseTree(sortTrees(children), childrenPrefix, output);
    };
    recurseTree(sortTrees(trees), '', output);
  }

  activitySet(total, workers) {
    if (!this.isTTY || this.noProgress) return super.activitySet(total, workers);

    const spinners = [],
      reporterSpinners = this._spinners;

    for (let i = 1; i < workers; i++) this.log('');

    for (let i = 0; i < workers; i++) {
      const spinner = new Spinner(this.stderr, i);
      reporterSpinners.add(spinner);
      spinner.start();

      let prefix = null,
        current = 0;
      const updatePrefix = () => {
        spinner.setPrefix(this.format.dim(`[${current === 0 ? '-' : current}/${total}]`) + ' ');
      };
      const clear = () => {
        prefix = null;
        current = 0;
        updatePrefix();
        spinner.setText('waiting...');
      };
      clear();

      spinners.unshift({
        clear,

        setPrefix(_current, _prefix) {
          current = _current;
          prefix = _prefix;
          spinner.setText(prefix);
          updatePrefix();
        },

        tick(msg) {
          if (prefix) msg = `${prefix}: ${msg}`;
          spinner.setText(msg);
        },

        end() {
          spinner.stop();
          reporterSpinners.delete(spinner);
        },
      });
    }

    return {
      spinners,
      end: () => {
        for (const spinner of spinners) spinner.end();

        readline.moveCursor(this.stdout, 0, 1 - workers);
      },
    };
  }

  activity() {
    if (!this.isTTY) return {tick() {}, end() {}};

    const reporterSpinners = this._spinners,

      spinner = new Spinner(this.stderr);
    spinner.start();

    reporterSpinners.add(spinner);

    return {
      tick(name) {
        spinner.setText(name);
      },

      end() {
        spinner.stop();
        reporterSpinners.delete(spinner);
      },
    };
  }

  select(header, question, options) {
    if (!this.isTTY) return Promise.reject(new Error("Can't answer a question unless a user TTY"));

    const rl = readline.createInterface({input: this.stdin, output: this.stdout, terminal: true}),

      questions = options.map((opt) => opt.name),
      answers = options.map((opt) => opt.value);

    function toIndex(input) {
      const index = answers.indexOf(input);

      return index >= 0 ? index : +input;
    }

    return new Promise(resolve => {
      this.info(header);

      for (let i = 0; i < questions.length; i++) this.log(`  ${this.format.dim(i + 1 + ')')} ${questions[i]}`);

      const ask = () => {
        rl.question(question + ': ', input => {
          let index = toIndex(input);

          if (isNaN(index)) {
            this.log('Not a number');
            ask();
          } else if (index <= 0 || index > options.length) {
            this.log('Outside answer range');
            ask();
          } else {
            index--;
            rl.close();
            resolve(answers[index]);
          }
        });
      };

      ask();
    });
  }

  progress(count) {
    if (this.noProgress || count <= 0 || !this.isTTY) return function() {};

    this.stopProgress();

    const bar = (this._progressBar = new ProgressBar(count, this.stderr, (progress) => {
      if (progress === this._progressBar) this._progressBar = null;
    }));

    bar.render();

    return function() {
      bar.tick();
    };
  }

  stopProgress() {
    this._progressBar && this._progressBar.stop();
  }

  prompt(message, choices, options = {}) {
    if (!process.stdout.isTTY) return Promise.reject(new Error("Can't answer a question unless a user TTY"));

    let pageSize;
    if (process.stdout instanceof tty.WriteStream) pageSize = process.stdout.rows - 2;

    const rl = readline.createInterface({input: this.stdin, output: this.stdout, terminal: true}),

      prompt = inquirer.createPromptModule({input: this.stdin, output: this.stdout}),

      {name = 'prompt', type = 'input', validate} = options;
    return prompt([{name, type, message, choices, pageSize, validate}]).then(answers => {
      rl.close();

      return answers[name];
    });
  }

  auditSummary(auditMetadata) {
    const {totalDependencies, vulnerabilities} = auditMetadata;
    const totalVulnerabilities =
      vulnerabilities.info +
      vulnerabilities.low +
      vulnerabilities.moderate +
      vulnerabilities.high +
      vulnerabilities.critical;
    const summary = this.lang(
      'auditSummary',
      totalVulnerabilities > 0 ? this.rawText(chalk.red(totalVulnerabilities.toString())) : totalVulnerabilities,
      totalDependencies
    );
    this._log(summary);

    if (totalVulnerabilities) {
      const severities = [];
      vulnerabilities.info && severities.push(this.lang('auditInfo', vulnerabilities.info));
      vulnerabilities.low && severities.push(this.lang('auditLow', vulnerabilities.low));

      vulnerabilities.moderate && severities.push(this.lang('auditModerate', vulnerabilities.moderate));
      vulnerabilities.high && severities.push(this.lang('auditHigh', vulnerabilities.high));
      vulnerabilities.critical && severities.push(this.lang('auditCritical', vulnerabilities.critical));

      this._log(`${this.lang('auditSummarySeverity')} ${severities.join(' | ')}`);
    }
  }

  auditAction(recommendation) {
    const label = recommendation.action.resolves.length === 1 ? 'vulnerability' : 'vulnerabilities';
    this._log(
      this.lang(
        'auditResolveCommand',
        this.rawText(chalk.inverse(recommendation.cmd)),
        recommendation.action.resolves.length,
        this.rawText(label)
      )
    );
    recommendation.isBreaking && this._log(this.lang('auditSemverMajorChange'));
  }

  auditManualReview() {
    const table = new Table({colWidths: [78]});
    table.push([{content: this.lang('auditManualReview'), vAlign: 'center', hAlign: 'center'}]);

    this._log(table.toString());
  }

  auditAdvisory(resolution, auditAdvisory) {
    function colorSeverity(severity, message) {
      return auditSeverityColors[severity](message || severity);
    }

    function makeAdvisoryTableRow(patchedIn) {
      const patchRows = [];

      patchedIn && patchRows.push({'Patched in': patchedIn});

      return [
        {[chalk.bold(colorSeverity(auditAdvisory.severity))]: chalk.bold(auditAdvisory.title)},
        {Package: auditAdvisory.module_name},
        ...patchRows,
        {'Dependency of': `${resolution.path.split('>')[0]} ${resolution.dev ? '[dev]' : ''}`},
        {Path: resolution.path.split('>').join(' > ')},
        {'More info': 'https://www.npmjs.com/advisories/' + auditAdvisory.id},
      ];
    }

    const table = new Table({colWidths: AUDIT_COL_WIDTHS, wordWrap: true});
    const patchedIn =
      auditAdvisory.patched_versions.replace(' ', '') === '<0.0.0'
        ? 'No patch available'
        : auditAdvisory.patched_versions;
    table.push(...makeAdvisoryTableRow(patchedIn));
    this._log(table.toString());
  }
}

class JSONReporter extends BaseReporter {
  constructor(opts) {
    super(opts);

    this._activityId = 0;
    this._progressId = 0;
  }

  _dump(type, data, error) {
    let stdout = this.stdout;
    if (error) stdout = this.stderr;

    stdout.write(JSON.stringify({type, data}) + '\n');
  }

  _verbose(msg) {
    this._dump('verbose', msg);
  }

  list(type, items, hints) {
    this._dump('list', {type, items, hints});
  }

  tree(type, trees) {
    this._dump('tree', {type, trees});
  }

  step(current, total, message) {
    this._dump('step', {message, current, total});
  }

  inspect(value) {
    this._dump('inspect', value);
  }

  footer(showPeakMemory) {
    this._dump('finished', this.getTotalTime());
  }

  log(msg) {
    this._dump('log', msg);
  }

  command(msg) {
    this._dump('command', msg);
  }

  table(head, body) {
    this._dump('table', {head, body});
  }

  success(msg) {
    this._dump('success', msg);
  }

  error(msg) {
    this._dump('error', msg, true);
  }

  warn(msg) {
    this._dump('warning', msg, true);
  }

  info(msg) {
    this._dump('info', msg);
  }

  activitySet(total, workers) {
    if (!this.isTTY || this.noProgress) return super.activitySet(total, workers);

    const id = this._activityId++;
    this._dump('activitySetStart', {id, total, workers});

    const spinners = [];
    for (let i = 0; i < workers; i++) {
      let current = 0,
        header = '';

      spinners.push({
        clear() {},
        setPrefix(_current, _header) {
          current = _current;
          header = _header;
        },
        tick: msg => {
          this._dump('activitySetTick', {id, header, current, worker: i, message: msg});
        },
        end() {},
      });
    }

    return {
      spinners,
      end: () => {
        this._dump('activitySetEnd', {id});
      },
    };
  }

  activity() {
    return this._activity({});
  }

  _activity(data) {
    if (!this.isTTY || this.noProgress) return {tick() {}, end() {}};

    const id = this._activityId++;
    this._dump('activityStart', {id, ...data});

    return {
      tick: (name) => {
        this._dump('activityTick', {id, name});
      },

      end: () => {
        this._dump('activityEnd', {id});
      },
    };
  }

  progress(total) {
    if (this.noProgress) return function() {};

    const id = this._progressId++;
    let current = 0;
    this._dump('progressStart', {id, total});

    return () => {
      current++;
      this._dump('progressTick', {id, current});

      current !== total || this._dump('progressFinish', {id});
    };
  }

  auditAction(recommendation) {
    this._dump('auditAction', recommendation);
  }

  auditAdvisory(resolution, auditAdvisory) {
    this._dump('auditAdvisory', {resolution, advisory: auditAdvisory});
  }

  auditSummary(auditMetadata) {
    this._dump('auditSummary', auditMetadata);
  }
}

class EventReporter extends JSONReporter {
  constructor(opts) {
    super(opts);

    events.EventEmitter.call(this);
  }

  _dump(type, data) {
    this.emit(type, data);
  }
}

Object.assign(EventReporter.prototype, events.EventEmitter.prototype);

class NoopReporter extends BaseReporter {
  lang(key, ...args) {
    return 'do nothing';
  }
  verbose(msg) {}
  verboseInspect(val) {}
  initPeakMemoryCounter() {}
  checkPeakMemory() {}
  close() {}
  getTotalTime() {
    return 0;
  }
  list(key, items, hints) {}
  tree(key, obj) {}
  step(current, total, message, emoji) {}
  error(message) {}
  info(message) {}
  warn(message) {}
  success(message) {}
  log(message) {}
  command(command) {}
  inspect(value) {}
  header(command, pkg) {}
  footer(showPeakMemory) {}
  table(head, body) {}

  activity() {
    return {tick(name) {}, end() {}};
  }

  activitySet(total, workers) {
    return {
      spinners: Array(workers).fill({clear() {}, setPrefix() {}, tick() {}, end() {}}),
      end() {},
    };
  }

  question(question, options = {}) {
    return Promise.reject(new Error('Not implemented'));
  }

  questionAffirm(question) {
    return this.question(question).then(() => false);
  }

  select(header, question, options) {
    return Promise.reject(new Error('Not implemented'));
  }

  progress(total) {
    return function() {};
  }

  disableProgress() {
    this.noProgress = true;
  }

  prompt(message, choices, options = {}) {
    return Promise.reject(new Error('Not implemented'));
  }
}

function getUid() {
  return process.platform !== 'win32' && process.getuid ? process.getuid() : null;
}

var ROOT_USER = isRootUser(getUid()) && !isFakeRoot();

function isFakeRoot() {
  return Boolean(process.env.FAKEROOTKEY);
}

function isRootUser(uid) {
  return uid === 0;
}

const home = os.homedir(),

  userHomeDir = ROOT_USER ? path.resolve('/usr/local/share') : home,

  FALLBACK_CONFIG_DIR = path.join(userHomeDir, '.config', 'yarn'),
  FALLBACK_CACHE_DIR = path.join(userHomeDir, '.cache', 'yarn');

function getDataDir() {
  if (process.platform === 'win32') {
    const WIN32_APPDATA_DIR = getLocalAppDataDir();
    return WIN32_APPDATA_DIR == null ? FALLBACK_CONFIG_DIR : path.join(WIN32_APPDATA_DIR, 'Data');
  }
  return process.env.XDG_DATA_HOME ? path.join(process.env.XDG_DATA_HOME, 'yarn') : FALLBACK_CONFIG_DIR;
}

function getCacheDir() {
  return process.platform === 'win32'
    ? path.join(getLocalAppDataDir() || path.join(userHomeDir, 'AppData', 'Local', 'Yarn'), 'Cache')
    : process.env.XDG_CACHE_HOME
    ? path.join(process.env.XDG_CACHE_HOME, 'yarn')
    : process.platform === 'darwin'
    ? path.join(userHomeDir, 'Library', 'Caches', 'Yarn')
    : FALLBACK_CACHE_DIR;
}

function getConfigDir() {
  if (process.platform === 'win32') {
    const WIN32_APPDATA_DIR = getLocalAppDataDir();
    return WIN32_APPDATA_DIR == null ? FALLBACK_CONFIG_DIR : path.join(WIN32_APPDATA_DIR, 'Config');
  }
  return process.env.XDG_CONFIG_HOME ? path.join(process.env.XDG_CONFIG_HOME, 'yarn') : FALLBACK_CONFIG_DIR;
}

function getLocalAppDataDir() {
  return process.env.LOCALAPPDATA ? path.join(process.env.LOCALAPPDATA, 'Yarn') : null;
}

var isWebpackBundle = typeof __webpack_require__ != 'undefined';

const DEPENDENCY_TYPES = ['devDependencies', 'dependencies', 'optionalDependencies', 'peerDependencies'],
  OWNED_DEPENDENCY_TYPES = ['devDependencies', 'dependencies', 'optionalDependencies'],

  RESOLUTIONS = 'resolutions',
  MANIFEST_FIELDS = [RESOLUTIONS, ...DEPENDENCY_TYPES],

  SUPPORTED_NODE_VERSIONS = '^4.8.0 || ^5.7.0 || ^6.2.2 || >=8.0.0',

  YARN_REGISTRY = 'https://registry.yarnpkg.com',
  NPM_REGISTRY_RE = /https?:\/\/registry\.npmjs\.org/g,

  YARN_DOCS = 'https://yarnpkg.com/en/docs/cli/',
  YARN_INSTALLER_SH = 'https://yarnpkg.com/install.sh',
  YARN_INSTALLER_MSI = 'https://yarnpkg.com/latest.msi',

  SELF_UPDATE_VERSION_URL = 'https://yarnpkg.com/latest-version',

  CACHE_VERSION = 6,

  NETWORK_CONCURRENCY = 8,
  NETWORK_TIMEOUT = 30000,

  CHILD_CONCURRENCY = 5,

  REQUIRED_PACKAGE_KEYS = ['name', 'version', '_uid'];

function getPreferredCacheDirectories() {
  const preferredCacheDirectories = [getCacheDir()];

  process.getuid && preferredCacheDirectories.push(path.join(os.tmpdir(), '.yarn-cache-' + process.getuid()));

  preferredCacheDirectories.push(path.join(os.tmpdir(), '.yarn-cache'));

  return preferredCacheDirectories;
}

const PREFERRED_MODULE_CACHE_DIRECTORIES = getPreferredCacheDirectories(),
  CONFIG_DIRECTORY = getConfigDir(),
  DATA_DIRECTORY = getDataDir(),
  LINK_REGISTRY_DIRECTORY = path.join(DATA_DIRECTORY, 'link'),
  GLOBAL_MODULE_DIRECTORY = path.join(DATA_DIRECTORY, 'global'),

  NODE_BIN_PATH = process.execPath,
  YARN_BIN_PATH = getYarnBinPath();

function getYarnBinPath() {
  return isWebpackBundle ? __filename : path.join(__dirname, '..', 'bin', 'yarn.js');
}

const NODE_MODULES_FOLDER = 'node_modules',
  NODE_PACKAGE_JSON = 'package.json',

  PNP_FILENAME = '.pnp.js',

  POSIX_GLOBAL_PREFIX = `${process.env.DESTDIR || ''}/usr/local`,
  FALLBACK_GLOBAL_PREFIX = path.join(userHomeDir, '.yarn'),

  META_FOLDER = '.yarn-meta',
  INTEGRITY_FILENAME = '.yarn-integrity',
  LOCKFILE_FILENAME = 'yarn.lock',
  METADATA_FILENAME = '.yarn-metadata.json',
  TARBALL_FILENAME = '.yarn-tarball.tgz',
  CLEAN_FILENAME = '.yarnclean',

  NPM_LOCK_FILENAME = 'package-lock.json',
  NPM_SHRINKWRAP_FILENAME = 'npm-shrinkwrap.json',

  DEFAULT_INDENT = '  ',
  SINGLE_INSTANCE_PORT = 31997,
  SINGLE_INSTANCE_FILENAME = '.yarn-single-instance',

  ENV_PATH_KEY = getPathKey(process.platform, process.env);

function getPathKey(platform, env) {
  let pathKey = 'PATH';

  if (platform === 'win32') {
    pathKey = 'Path';

    for (const key in env) if (key.toLowerCase() === 'path') pathKey = key;
  }

  return pathKey;
}

const VERSION_COLOR_SCHEME = {
  major: 'red',
  premajor: 'red',
  minor: 'yellow',
  preminor: 'yellow',
  patch: 'green',
  prepatch: 'green',
  prerelease: 'red',
  unchanged: 'white',
  unknown: 'red',
};

function nullify(obj = {}) {
  if (Array.isArray(obj)) for (const item of obj) nullify(item);
  else if ((obj !== null && typeof obj == 'object') || typeof obj == 'function') {
    Object.setPrototypeOf(obj, null);

    if (typeof obj == 'object') for (const key in obj) nullify(obj[key]);
  }

  return obj;
}

const debug = _libs.debug('yarn');

class BlockingQueue {
  constructor(alias, maxConcurrency = Infinity) {
    this.concurrencyQueue = [];
    this.maxConcurrency = maxConcurrency;
    this.runningCount = 0;
    this.warnedStuck = false;
    this.alias = alias;
    this.first = true;

    this.running = nullify();
    this.queue = nullify();

    this.stuckTick = this.stuckTick.bind(this);
  }

  stillActive() {
    this.stuckTimer && clearTimeout(this.stuckTimer);

    this.stuckTimer = setTimeout(this.stuckTick, 5000);

    this.stuckTimer.unref && this.stuckTimer.unref();
  }

  stuckTick() {
    if (this.runningCount === 1) {
      this.warnedStuck = true;
      debug(
        `The ${JSON.stringify(this.alias)} blocking queue may be stuck. 5 seconds without any activity with 1 worker: ` +
          Object.keys(this.running)[0]
      );
    }
  }

  push(key, factory) {
    this.first ? (this.first = false) : this.stillActive();

    return new Promise((resolve, reject) => {
      (this.queue[key] = this.queue[key] || []).push({factory, resolve, reject});

      this.running[key] || this.shift(key);
    });
  }

  shift(key) {
    if (this.running[key]) {
      delete this.running[key];
      this.runningCount--;

      if (this.stuckTimer) {
        clearTimeout(this.stuckTimer);
        this.stuckTimer = null;
      }

      if (this.warnedStuck) {
        this.warnedStuck = false;
        debug(JSON.stringify(this.alias) + ' blocking queue finally resolved. Nothing to worry about.');
      }
    }

    const queue = this.queue[key];
    if (!queue) return;

    const {resolve, reject, factory} = queue.shift();
    queue.length || delete this.queue[key];

    const next = () => {
      this.shift(key);
      this.shiftConcurrencyQueue();
    };

    const run = () => {
      this.running[key] = true;
      this.runningCount++;

      factory()
        .then(function(val) {
          resolve(val);
          next();
          return null;
        })
        .catch(function(err) {
          reject(err);
          next();
        });
    };

    this.maybePushConcurrencyQueue(run);
  }

  maybePushConcurrencyQueue(run) {
    this.runningCount < this.maxConcurrency ? run() : this.concurrencyQueue.push(run);
  }

  shiftConcurrencyQueue() {
    if (this.runningCount < this.maxConcurrency) {
      const fn = this.concurrencyQueue.shift();
      fn && fn();
    }
  }
}

function promisify(fn, firstData) {
  return function(...args) {
    return new Promise((resolve, reject) => {
      args.push(function(err) {
        let res;

        if (firstData) {
          res = err;
          err = null;
        } else
          res = arguments.length <= 2 ? arguments[1] : Array.prototype.slice.call(arguments, 1);

        err ? reject(err) : resolve(res);
      });

      fn.apply(null, args);
    });
  };
}

function queue(arr, promiseProducer, concurrency = Infinity) {
  concurrency = Math.min(concurrency, arr.length);

  arr = arr.slice();

  const results = [];
  let total = arr.length;
  if (!total) return Promise.resolve(results);

  return new Promise((resolve, reject) => {
    for (let i = 0; i < concurrency; i++) next();

    function next() {
      const item = arr.shift();

      promiseProducer(item).then(function(result) {
        results.push(result);

        total--;
        total <= 0 ? resolve(results) : arr.length && next();
      }, reject);
    }
  });
}

let disableTimestampCorrection = void 0;

const readFileBuffer = promisify(fs.readFile),
  close = promisify(fs.close),
  lstat = promisify(fs.lstat),
  open = promisify(fs.open),
  futimes = promisify(fs.futimes),

  write = promisify(fs.write),

  unlink = promisify(_libs.rimraf);

const copyFile = async function(data, cleanup) {
  const ficloneFlag = constants.COPYFILE_FICLONE || 0;
  try {
    await unlink(data.dest);
    await copyFilePoly(data.src, data.dest, ficloneFlag, data);
  } finally {
    cleanup && cleanup();
  }
};

const copyFilePoly = (src, dest, flags, data) =>
  fs.copyFile
    ? new Promise((resolve, reject) =>
        fs.copyFile(src, dest, flags, err => {
          err ? reject(err) : fixTimes(void 0, dest, data).then(() => resolve(), reject);
        })
      )
    : copyWithBuffer(src, dest, flags, data);

const copyWithBuffer = async (src, dest, flags, data) => {
  const fd = await open(dest, 'w', data.mode);
  try {
    const buffer = await readFileBuffer(src);
    await write(fd, buffer, 0, buffer.length);
    await fixTimes(fd, dest, data);
  } finally {
    await close(fd);
  }
};

async function fixTimes(fd, dest, data) {
  const doOpen = fd === void 0;
  let openfd = fd || -1;

  if (disableTimestampCorrection === void 0) {
    const destStat = await lstat(dest);
    disableTimestampCorrection = fileDatesEqual(destStat.mtime, data.mtime);
  }

  if (disableTimestampCorrection) return;

  if (doOpen)
    try {
      openfd = await open(dest, 'a', data.mode);
    } catch (_er) {
      try {
        openfd = await open(dest, 'r', data.mode);
      } catch (_err) {
        return;
      }
    }

  try {
    if (openfd) await futimes(openfd, data.atime, data.mtime);
  } catch (_er) {
  } finally {
    if (doOpen && openfd) await close(openfd);
  }
}

const fileDatesEqual = (a, b) => {
  const aTime = a.getTime(),
    bTime = b.getTime();

  if (process.platform !== 'win32') return aTime === bTime;

  if (Math.abs(aTime - bTime) <= 1) return true;

  const aTimeSec = Math.floor(aTime / 1000),
    bTimeSec = Math.floor(bTime / 1000);

  return aTime - aTimeSec * 1000 == 0 || bTime - bTimeSec * 1000 == 0 ? aTimeSec === bTimeSec : aTime === bTime;
};

var stripBOM = x => {
  if (typeof x != 'string') throw new TypeError('Expected a string, got ' + typeof x);

  return x.charCodeAt(0) === 0xFEFF ? x.slice(1) : x;
};

const constants = fs.constants !== void 0 ? fs.constants : {R_OK: fs.R_OK, W_OK: fs.W_OK, X_OK: fs.X_OK},

  lockQueue = new BlockingQueue('fs lock'),

  readFileBuffer$1 = promisify(fs.readFile),
  open$1 = promisify(fs.open),
  writeFile = promisify(fs.writeFile),
  readlink = promisify(fs.readlink),
  realpath = promisify(fs.realpath),
  readdir = promisify(fs.readdir),
  rename = promisify(fs.rename),
  access = promisify(fs.access),
  stat = promisify(fs.stat),
  mkdirp = promisify(_libs.mkdirp),

  exists = promisify(fs.exists, true),
  lstat$1 = promisify(fs.lstat),
  chmod = promisify(fs.chmod),
  link = promisify(fs.link),
  glob = promisify(globModule),

  CONCURRENT_QUEUE_ITEMS = fs.copyFile ? 128 : 4,

  fsSymlink = promisify(fs.symlink),

  noop = () => {};

async function buildActionsForCopy(queue, events, possibleExtraneous, reporter) {
  const artifactFiles = new Set(events.artifactFiles || []),
    files = new Set();

  for (const item of queue) {
    const onDone = item.onDone;
    item.onDone = () => {
      events.onProgress(item.dest);
      onDone && onDone();
    };
  }
  events.onStart(queue.length);

  const actions = {file: [], symlink: [], link: []};

  while (queue.length) {
    const items = queue.splice(0, CONCURRENT_QUEUE_ITEMS);
    await Promise.all(items.map(build));
  }

  for (const file of artifactFiles)
    if (possibleExtraneous.has(file)) {
      reporter.verbose(reporter.lang('verboseFilePhantomExtraneous', file));
      possibleExtraneous.delete(file);
    }

  for (const loc of possibleExtraneous) files.has(loc.toLowerCase()) && possibleExtraneous.delete(loc);

  return actions;

  async function build(data) {
    const {src, dest, type} = data,
      onFresh = data.onFresh || noop,
      onDone = data.onDone || noop;

    files.has(dest.toLowerCase())
      ? reporter.verbose(`The case-insensitive file ${dest} shouldn't be copied twice in one bulk copy`)
      : files.add(dest.toLowerCase());

    if (type === 'symlink') {
      await mkdirp(path.dirname(dest));
      onFresh();
      actions.symlink.push({dest, linkname: src});
      onDone();
      return;
    }

    if (events.ignoreBasenames.indexOf(path.basename(src)) >= 0) return;

    const srcStat = await lstat$1(src);
    let srcFiles, destStat;

    if (srcStat.isDirectory()) srcFiles = await readdir(src);

    try {
      destStat = await lstat$1(dest);
    } catch (e) {
      if (e.code !== 'ENOENT') throw e;
    }

    if (destStat) {
      const bothSymlinks = srcStat.isSymbolicLink() && destStat.isSymbolicLink(),
        bothFolders = srcStat.isDirectory() && destStat.isDirectory(),
        bothFiles = srcStat.isFile() && destStat.isFile();

      if (bothFiles && artifactFiles.has(dest)) {
        onDone();
        reporter.verbose(reporter.lang('verboseFileSkipArtifact', src));
        return;
      }

      if (bothFiles && srcStat.size === destStat.size && fileDatesEqual(srcStat.mtime, destStat.mtime)) {
        onDone();
        reporter.verbose(reporter.lang('verboseFileSkip', src, dest, srcStat.size, +srcStat.mtime));
        return;
      }

      if (bothSymlinks) {
        const srcReallink = await readlink(src);
        if (srcReallink === (await readlink(dest))) {
          onDone();
          reporter.verbose(reporter.lang('verboseFileSkipSymlink', src, dest, srcReallink));
          return;
        }
      }

      if (bothFolders) {
        const destFiles = await readdir(dest);
        invariant(srcFiles, 'src files not initialised');

        for (const file of destFiles)
          if (srcFiles.indexOf(file) < 0) {
            const loc = path.join(dest, file);
            possibleExtraneous.add(loc);

            if ((await lstat$1(loc)).isDirectory())
              for (const file of await readdir(loc)) possibleExtraneous.add(path.join(loc, file));
          }
      }
    }

    if (destStat && destStat.isSymbolicLink()) {
      await unlink(dest);
      destStat = null;
    }

    if (srcStat.isSymbolicLink()) {
      onFresh();
      const linkname = await readlink(src);
      actions.symlink.push({dest, linkname});
      onDone();
    } else if (srcStat.isDirectory()) {
      if (!destStat) {
        reporter.verbose(reporter.lang('verboseFileFolder', dest));
        await mkdirp(dest);
      }

      for (const destParts = dest.split(path.sep); destParts.length; ) {
        files.add(destParts.join(path.sep).toLowerCase());
        destParts.pop();
      }

      invariant(srcFiles, 'src files not initialised');
      let remaining = srcFiles.length;
      remaining || onDone();

      for (const file of srcFiles)
        queue.push({
          dest: path.join(dest, file),
          onFresh,
          onDone: () => {
            --remaining > 0 || onDone();
          },
          src: path.join(src, file),
        });
    } else {
      if (!srcStat.isFile()) throw new Error('unsure how to copy this: ' + src);
      onFresh();
      actions.file.push({src, dest, atime: srcStat.atime, mtime: srcStat.mtime, mode: srcStat.mode});
      onDone();
    }
  }
}

async function buildActionsForHardlink(queue, events, possibleExtraneous, reporter) {
  const artifactFiles = new Set(events.artifactFiles || []),
    files = new Set();

  for (const item of queue) {
    const onDone = item.onDone || noop;
    item.onDone = () => {
      events.onProgress(item.dest);
      onDone();
    };
  }
  events.onStart(queue.length);

  const actions = {file: [], symlink: [], link: []};

  while (queue.length) {
    const items = queue.splice(0, CONCURRENT_QUEUE_ITEMS);
    await Promise.all(items.map(build));
  }

  for (const file of artifactFiles)
    if (possibleExtraneous.has(file)) {
      reporter.verbose(reporter.lang('verboseFilePhantomExtraneous', file));
      possibleExtraneous.delete(file);
    }

  for (const loc of possibleExtraneous) files.has(loc.toLowerCase()) && possibleExtraneous.delete(loc);

  return actions;

  async function build(data) {
    const {src, dest} = data,
      onFresh = data.onFresh || noop,
      onDone = data.onDone || noop;
    if (files.has(dest.toLowerCase())) {
      onDone();
      return;
    }
    files.add(dest.toLowerCase());

    if (events.ignoreBasenames.indexOf(path.basename(src)) >= 0) return;

    const srcStat = await lstat$1(src);
    let srcFiles;

    if (srcStat.isDirectory()) srcFiles = await readdir(src);

    const destExists = await exists(dest);
    if (destExists) {
      const destStat = await lstat$1(dest),

        bothSymlinks = srcStat.isSymbolicLink() && destStat.isSymbolicLink(),
        bothFolders = srcStat.isDirectory() && destStat.isDirectory(),
        bothFiles = srcStat.isFile() && destStat.isFile();

      if (srcStat.mode !== destStat.mode)
        try {
          await access(dest, srcStat.mode);
        } catch (err) {
          reporter.verbose(err);
        }

      if (bothFiles && artifactFiles.has(dest)) {
        onDone();
        reporter.verbose(reporter.lang('verboseFileSkipArtifact', src));
        return;
      }

      if (bothFiles && srcStat.ino !== null && srcStat.ino === destStat.ino) {
        onDone();
        reporter.verbose(reporter.lang('verboseFileSkip', src, dest, srcStat.ino));
        return;
      }

      if (bothSymlinks) {
        const srcReallink = await readlink(src);
        if (srcReallink === (await readlink(dest))) {
          onDone();
          reporter.verbose(reporter.lang('verboseFileSkipSymlink', src, dest, srcReallink));
          return;
        }
      }

      if (bothFolders) {
        const destFiles = await readdir(dest);
        invariant(srcFiles, 'src files not initialised');

        for (const file of destFiles)
          if (srcFiles.indexOf(file) < 0) {
            const loc = path.join(dest, file);
            possibleExtraneous.add(loc);

            if ((await lstat$1(loc)).isDirectory())
              for (const file of await readdir(loc)) possibleExtraneous.add(path.join(loc, file));
          }
      }
    }

    if (srcStat.isSymbolicLink()) {
      onFresh();
      const linkname = await readlink(src);
      actions.symlink.push({dest, linkname});
      onDone();
    } else if (srcStat.isDirectory()) {
      reporter.verbose(reporter.lang('verboseFileFolder', dest));
      await mkdirp(dest);

      for (const destParts = dest.split(path.sep); destParts.length; ) {
        files.add(destParts.join(path.sep).toLowerCase());
        destParts.pop();
      }

      invariant(srcFiles, 'src files not initialised');
      let remaining = srcFiles.length;
      remaining || onDone();

      for (const file of srcFiles)
        queue.push({
          onFresh,
          src: path.join(src, file),
          dest: path.join(dest, file),
          onDone: () => {
            --remaining > 0 || onDone();
          },
        });
    } else {
      if (!srcStat.isFile()) throw new Error('unsure how to copy this: ' + src);
      onFresh();
      actions.link.push({src, dest, removeDest: destExists});
      onDone();
    }
  }
}

function copy(src, dest, reporter) {
  return copyBulk([{src, dest}], reporter);
}

async function copyBulk(queue$1, reporter, _events) {
  const events = {
    onStart: (_events && _events.onStart) || noop,
    onProgress: (_events && _events.onProgress) || noop,
    possibleExtraneous: _events ? _events.possibleExtraneous : new Set(),
    ignoreBasenames: (_events && _events.ignoreBasenames) || [],
    artifactFiles: (_events && _events.artifactFiles) || [],
  };

  const actions = await buildActionsForCopy(queue$1, events, events.possibleExtraneous, reporter);
  events.onStart(actions.file.length + actions.symlink.length + actions.link.length);

  const fileActions = actions.file,

    currentlyWriting = new Map();

  await queue(
    fileActions,
    async (data) => {
      for (let writePromise; (writePromise = currentlyWriting.get(data.dest)); ) await writePromise;

      reporter.verbose(reporter.lang('verboseFileCopy', data.src, data.dest));
      const copier = copyFile(data, () => currentlyWriting.delete(data.dest));
      currentlyWriting.set(data.dest, copier);
      events.onProgress(data.dest);
      return copier;
    },
    CONCURRENT_QUEUE_ITEMS
  );

  const symlinkActions = actions.symlink;
  await queue(symlinkActions, (data) => {
    const linkname = path.resolve(path.dirname(data.dest), data.linkname);
    reporter.verbose(reporter.lang('verboseFileSymlink', data.dest, linkname));
    return symlink(linkname, data.dest);
  });
}

async function hardlinkBulk(queue$1, reporter, _events) {
  const events = {
    onStart: (_events && _events.onStart) || noop,
    onProgress: (_events && _events.onProgress) || noop,
    possibleExtraneous: _events ? _events.possibleExtraneous : new Set(),
    artifactFiles: (_events && _events.artifactFiles) || [],
    ignoreBasenames: [],
  };

  const actions = await buildActionsForHardlink(queue$1, events, events.possibleExtraneous, reporter);
  events.onStart(actions.file.length + actions.symlink.length + actions.link.length);

  const fileActions = actions.link;

  await queue(
    fileActions,
    async (data) => {
      reporter.verbose(reporter.lang('verboseFileLink', data.src, data.dest));
      if (data.removeDest) await unlink(data.dest);

      await link(data.src, data.dest);
    },
    CONCURRENT_QUEUE_ITEMS
  );

  const symlinkActions = actions.symlink;
  await queue(symlinkActions, (data) => {
    const linkname = path.resolve(path.dirname(data.dest), data.linkname);
    reporter.verbose(reporter.lang('verboseFileSymlink', data.dest, linkname));
    return symlink(linkname, data.dest);
  });
}

const _readFile = promisify(fs.readFile);

function readFile(loc) {
  return _readFile(loc, 'utf8').then(normalizeOS);
}

function readJson(loc) {
  return readJsonAndFile(loc).then(res => res.object);
}

function readJsonAndFile(loc) {
  return readFile(loc).then(file => {
    try {
      return {object: nullify(JSON.parse(stripBOM(file))), content: file};
    } catch (err) {
      err.message = `${loc}: ${err.message}`;
      throw err;
    }
  });
}

async function symlink(src, dest) {
  if (process.platform !== 'win32') src = (src = path.relative(path.dirname(dest), src)) || '.'; //

  try {
    if ((await lstat$1(dest)).isSymbolicLink() && dest === src) return;
  } catch (err) {
    if (err.code !== 'ENOENT') throw err;
  }

  await unlink(dest);

  process.platform === 'win32' ? await fsSymlink(src, dest, 'junction') : await fsSymlink(src, dest);
}

async function walk(dir, relativeDir, ignoreBasenames = new Set()) {
  let files = [],

    filenames = await readdir(dir);
  if (ignoreBasenames.size) filenames = filenames.filter(name => !ignoreBasenames.has(name));

  for (const name of filenames) {
    const relative = relativeDir ? path.join(relativeDir, name) : name,
      loc = path.join(dir, name),
      stat = await lstat$1(loc);

    files.push({relative, basename: name, absolute: loc, mtime: +stat.mtime});

    if (stat.isDirectory()) files = files.concat(await walk(loc, relative, ignoreBasenames));
  }

  return files;
}

function getFileSizeOnDisk(loc) {
  return lstat$1(loc).then(stat => {
    const {size, blksize: blockSize} = stat;

    return Math.ceil(size / blockSize) * blockSize;
  });
}

function normalizeOS(body) {
  return body.replace(/\r\n/g, '\n');
}

const cr = '\r'.charCodeAt(0),
  lf = '\n'.charCodeAt(0);

function getEolFromFile(path) {
  return exists(path).then(ok => {
    if (!ok) return Promise.resolve();

    return readFileBuffer$1(path).then(buffer => {
      for (let i = 0; i < buffer.length; ++i) {
        if (buffer[i] === cr) return '\r\n';
        if (buffer[i] === lf) return '\n';
      }
      return void 0;
    });
  });
}

async function writeFilePreservingEol(path, data) {
  const eol = (await getEolFromFile(path)) || os.EOL;
  if (eol !== '\n') data = data.replace(/\n/g, eol);

  await writeFile(path, data);
}

async function hardlinksWork(dir) {
  const filename = 'test-file' + Math.random(),
    file = path.join(dir, filename),
    fileLink = path.join(dir, filename + '-link');
  try {
    await writeFile(file, 'test');
    await link(file, fileLink);
  } catch (_err) {
    return false;
  } finally {
    await unlink(file);
    await unlink(fileLink);
  }
  return true;
}

async function makeTempDir(prefix) {
  const dir = path.join(os.tmpdir(), `yarn-${prefix || ''}-${Date.now()}-${Math.random()}`);
  await unlink(dir);
  await mkdirp(dir);
  return dir;
}

async function readFirstAvailableStream(paths) {
  for (const path of paths)
    try {
      const fd = await open$1(path, 'r');
      return fs.createReadStream(path, {fd});
    } catch (_err) {}

  return null;
}

async function getFirstSuitableFolder(paths, mode = constants.W_OK | constants.X_OK) {
  const result = {skipped: [], folder: null};

  for (const folder of paths)
    try {
      await mkdirp(folder);
      await access(folder, mode);

      result.folder = folder;

      return result;
    } catch (error) {
      result.skipped.push({error, folder});
    }

  return result;
}

class MessageError extends Error {
  constructor(msg, code) {
    super(msg);
    this.code = code;
  }
}

class ProcessSpawnError extends MessageError {
  constructor(msg, code, process) {
    super(msg, code);
    this.process = process;
  }
}

class SecurityError extends MessageError {}

class ProcessTermError extends MessageError {
  constructor(msg, code) {
    super(msg, code);

    this.EXIT_CODE = void 0;
    this.EXIT_SIGNAL = void 0;
  }
}

class ResponseError extends Error {
  constructor(msg, responseCode) {
    super(msg);
    this.responseCode = responseCode;
  }
}

class OneTimePasswordError extends Error {
  constructor(notice) {
    super();
    this.notice = notice;
  }
}

function buildSubCommands(rootCommandName, subCommands, usage = []) {
  const subCommandNames = Object.keys(subCommands).map(hyphenate);

  function setFlags(commander) {
    commander.usage(`${rootCommandName} [${subCommandNames.join('|')}] [flags]`);
  }

  async function run(config, reporter, flags, args) {
    const subName = camelCase(args.shift() || '');
    if (subName && subCommands[subName]) {
      const command = subCommands[subName];
      if ((await command(config, reporter, flags, args)) !== false) return void 0; // .resolve()
    }

    if (usage && usage.length) {
      reporter.error(reporter.lang('usage') + ':');
      for (const msg of usage) reporter.error(`yarn ${rootCommandName} ${msg}`);
    }
    throw new MessageError(reporter.lang('invalidCommand', subCommandNames.join(', '))); // .reject()
  }

  function hasWrapper(commander, args) {
    return true;
  }

  return {run, setFlags, hasWrapper, examples: usage.map((cmd) => `${rootCommandName} ${cmd}`)};
}

function hasWrapper(flags, args) {
  return args[0] !== 'dir';
}

async function getCachedPackagesDirs(config, currentPath) {
  const results = [];

  if (!(await lstat$1(currentPath)).isDirectory()) return results;

  const folders = await readdir(currentPath);
  for (const folder of folders) {
    if (folder[0] === '.') continue;

    const packageParentPath = path.join(currentPath, folder, 'node_modules'),

      candidates = await readdir(packageParentPath);
    invariant(
      candidates.length === 1,
      `There should only be one folder in a package cache (got ${candidates.join(',')} in ${packageParentPath})`
    );

    for (const candidate of candidates) {
      const candidatePath = path.join(packageParentPath, candidate);
      if (candidate.charAt(0) === '@') {
        const subCandidates = await readdir(candidatePath);
        invariant(
          subCandidates.length === 1,
          `There should only be one folder in a package cache (got ${subCandidates.join(',')} in ${candidatePath})`
        );

        for (const subCandidate of subCandidates) {
          const subCandidatePath = path.join(candidatePath, subCandidate);
          results.push(subCandidatePath);
        }
      } else results.push(candidatePath);
    }
  }

  return results;
}

function _getMetadataWithPath(getMetadataFn, paths) {
  return Promise.all(
    paths.map(path =>
      getMetadataFn(path)
        .then(r => {
          r._path = path;
          return r;
        })
        .catch(_error => {})
    )
  );
}

function getCachedPackages(config) {
  return getCachedPackagesDirs(config, config.cacheFolder).then(paths =>
    _getMetadataWithPath(config.readPackageMetadata.bind(config), paths).then(packages => packages.filter(p => !!p))
  );
}

function list(config, reporter, flags, args) {
  const filterOut = ({registry, package: manifest, remote} = {}) =>
    !(flags.pattern && !micromatch.contains(manifest.name, flags.pattern));

  const forReport = ({registry, package: manifest, remote} = {}) => [
    manifest.name,
    manifest.version,
    registry,
    (remote && remote.resolved) || '',
  ];

  return getCachedPackages(config).then(packages => {
    const body = packages.filter(filterOut).map(forReport);
    reporter.table(['Name', 'Version', 'Registry', 'Resolved'], body);
  });
}

async function clean(config, reporter, flags, args) {
  if (!config.cacheFolder) return;

  const activity = reporter.activity();

  if (args.length > 0) {
    const shouldDelete = ({registry, package: manifest, remote} = {}) => args.indexOf(manifest.name) > -1,
      packagesToDelete = (await getCachedPackages(config)).filter(shouldDelete);

    for (const manifest of packagesToDelete) {
      let relativePath = path.relative(config.cacheFolder, manifest._path);
      while (relativePath && relativePath !== '.') {
        await unlink(path.resolve(config.cacheFolder, relativePath));
        relativePath = path.dirname(relativePath);
      }
    }

    activity.end();
    reporter.success(reporter.lang('clearedPackageFromCache', args[0]));
  } else {
    await unlink(config._cacheRootFolder);
    await mkdirp(config.cacheFolder);
    activity.end();
    reporter.success(reporter.lang('clearedCache'));
  }
}

const {run, setFlags: _setFlags, examples} = buildSubCommands('cache', {
  ls(config, reporter, flags, args) {
    reporter.warn('`yarn cache ls` is deprecated. Please use `yarn cache list`.');
    return list(config, reporter, flags).then(noop);
  },
  list,
  clean,
  dir(config, reporter) {
    reporter.log(config.cacheFolder, {force: true});
  },
});

function setFlags(commander) {
  _setFlags(commander);
  commander.description('Yarn cache list will print out every cached package.');
  commander.option('--pattern [pattern]', 'filter cached packages by pattern');
}

var cache = {
  __proto__: null,
  hasWrapper,
  getCachedPackagesDirs,
  run,
  examples,
  setFlags,
};

class BaseResolver {
  constructor(request, fragment) {
    this.resolver = request.resolver;
    this.reporter = request.reporter;
    this.fragment = fragment;
    this.registry = request.registry;
    this.request = request;
    this.pattern = request.pattern;
    this.config = request.config;
  }

  fork(Resolver, resolveArg, ...args) {
    const resolver = new Resolver(this.request, ...args);
    resolver.registry = this.registry;
    return resolver.resolve(resolveArg);
  }

  resolve(resolveArg) {
    throw new Error('Not implemented');
  }
}

class RegistryResolver extends BaseResolver {
  constructor(request, name, range) {
    super(request, `${name}@${range}`);
    this.name = name;
    this.range = range;

    this.registryConfig = request.config.registries[this.constructor.registry].config;
  }
}

function getPlatformSpecificPackageFilename(pkg) {
  const normalizeScope = name => (name[0] === '@' ? name.substr(1).replace('/', '-') : name),
    suffix = getSystemParams();
  return `${normalizeScope(pkg.name)}-v${pkg.version}-${suffix}`;
}

function getSystemParams() {
  return `${process.platform}-${process.arch}-${process.versions.modules || ''}`;
}

const NPM_REGISTRY_ID = 'npm';

class NpmResolver extends RegistryResolver {
  static registry = NPM_REGISTRY_ID;

  static async findVersionInRegistryResponse(config, name, range, body, request) {
    if (body.versions && Object.keys(body.versions).length === 0)
      throw new MessageError(config.reporter.lang('registryNoVersions', body.name));

    if (!body['dist-tags'] || !body.versions)
      throw new MessageError(config.reporter.lang('malformedRegistryResponse', name));

    if (range in body['dist-tags']) range = body['dist-tags'][range];

    if (config.packageDateLimit && body.time) {
      const releaseDates = body.time;
      let closestVersion = null;
      semver.rsort(Object.keys(body.versions)).some(v => {
        if (releaseDates[v] && semver.satisfies(v, range)) {
          closestVersion = v;
          if (releaseDates[v] < config.packageDateLimit) return true;
        }
        return false;
      });
      if (closestVersion) return body.versions[closestVersion];
    }

    const latestVersion = body['dist-tags'] ? body['dist-tags'].latest : void 0;
    if (latestVersion && semver.satisfies(latestVersion, range)) return body.versions[latestVersion];

    const satisfied = await config.resolveConstraints(Object.keys(body.versions), range);
    if (satisfied) return body.versions[satisfied];
    if (request && !config.nonInteractive) {
      request.resolver && request.resolver.activity && request.resolver.activity.end();

      config.reporter.log(config.reporter.lang('couldntFindVersionThatMatchesRange', body.name, range));
      let pageSize;
      if (process.stdout instanceof tty.WriteStream) pageSize = process.stdout.rows - 2;

      const response = await inquirer.prompt([
        {
          name: 'package',
          type: 'list',
          message: config.reporter.lang('chooseVersionFromList', body.name),
          choices: semver.rsort(Object.keys(body.versions)),
          pageSize,
        },
      ]);
      if (response && response.package) return body.versions[response.package];
    }
    throw new MessageError(config.reporter.lang('couldntFindVersionThatMatchesRange', body.name, range));
  }

  async resolveRequest(desiredVersion) {
    if (this.config.offline) {
      const res = await this.resolveRequestOffline();
      if (res != null) return res;
    }

    const escapedName = NpmRegistry.escapeName(this.name),
      desiredRange = desiredVersion || this.range,
      body = await this.config.registries.npm.request(escapedName, {unfiltered: !!this.config.packageDateLimit});

    return body
      ? NpmResolver.findVersionInRegistryResponse(this.config, escapedName, desiredRange, body, this.request)
      : null;
  }

  async resolveRequestOffline() {
    const packageDirs = await this.config.getCache('cachedPackages', () =>
      getCachedPackagesDirs(this.config, this.config.cacheFolder)
    );

    const versions = nullify();

    for (const dir of packageDirs) {
      if (dir.indexOf(NPM_REGISTRY_ID + '-') < 0) continue;

      const pkg = await this.config.readManifest(dir, NPM_REGISTRY_ID);
      if (pkg.name !== this.name) continue;

      const metadata = await this.config.readPackageMetadata(dir);

      if (metadata.remote) versions[pkg.version] = Object.assign({}, pkg, {_remote: metadata.remote});
    }

    const satisfied = await this.config.resolveConstraints(Object.keys(versions), this.range);
    if (satisfied) return versions[satisfied];
    if (this.config.preferOffline) return null;

    throw new MessageError(
      this.reporter.lang('couldntFindPackageInCache', this.name, this.range, Object.keys(versions).join(', '))
    );
  }

  cleanRegistry(url) {
    return this.config.getOption('registry') === YARN_REGISTRY ? url.replace(NPM_REGISTRY_RE, YARN_REGISTRY) : url;
  }

  async resolve() {
    const shrunk = this.request.getLocked('tarball');
    if (shrunk && this.config.packBuiltPackages && shrunk.prebuiltVariants && shrunk._remote) {
      const prebuiltVariants = shrunk.prebuiltVariants,
        prebuiltName = getPlatformSpecificPackageFilename(shrunk),
        offlineMirrorPath = this.config.getOfflineMirrorPath();
      if (prebuiltVariants[prebuiltName] && offlineMirrorPath) {
        const filename = path.join(offlineMirrorPath, 'prebuilt', prebuiltName + '.tgz'),
          {_remote} = shrunk;
        if (_remote && (await exists(filename))) {
          _remote.reference = 'file:' + filename;
          _remote.hash = prebuiltVariants[prebuiltName];
          _remote.integrity = ssri.fromHex(_remote.hash, 'sha1').toString();
        }
      }
    }
    if (shrunk && shrunk._remote && (shrunk._remote.integrity || this.config.offline || !this.config.autoAddIntegrity))
      return shrunk;

    const desiredVersion = shrunk && shrunk.version ? shrunk.version : null,
      info = await this.resolveRequest(desiredVersion);
    if (info == null)
      throw new MessageError(this.reporter.lang('packageNotFoundRegistry', this.name, NPM_REGISTRY_ID));

    const {deprecated, dist} = info;
    if (shrunk && shrunk._remote) {
      shrunk._remote.integrity =
        dist && dist.integrity
          ? ssri.parse(dist.integrity)
          : ssri.fromHex(dist && dist.shasum ? dist.shasum : '', 'sha1');
      return shrunk;
    }

    if (typeof deprecated == 'string') {
      let human = `${info.name}@${info.version}`;
      const parentNames = this.request.parentNames;
      if (parentNames.length) human = parentNames.concat(human).join(' > ');

      this.reporter.warn(`${human}: ${deprecated}`);
    }

    if (dist != null && dist.tarball)
      info._remote = {
        resolved: `${this.cleanRegistry(dist.tarball)}#${dist.shasum}`,
        type: 'tarball',
        reference: this.cleanRegistry(dist.tarball),
        hash: dist.shasum,
        integrity: dist.integrity ? ssri.parse(dist.integrity) : ssri.fromHex(dist.shasum, 'sha1'),
        registry: NPM_REGISTRY_ID,
        packageName: info.name,
      };

    info._uid = info.version;

    return info;
  }
}

const ENV_EXPR = /(\\*)\$\{([^}]+)\}/g;

function envReplace(value, env = process.env) {
  if (typeof value != 'string' || !value) return value;

  return value.replace(ENV_EXPR, (match, esc, envVarName) => {
    if (esc.length && esc.length % 2) return match;

    if (void 0 === env[envVarName]) throw new Error('Failed to replace env in config: ' + match);

    return env[envVarName] || '';
  });
}

class BaseRegistry {
  constructor(cwd, registries, requestManager, reporter, enableDefaultRc, extraneousRcFiles) {
    this.reporter = reporter;
    this.requestManager = requestManager;
    this.registries = registries;
    this.config = {};
    this.folder = '';
    this.token = '';
    this.loc = '';
    this.cwd = cwd;
    this.enableDefaultRc = enableDefaultRc;
    this.extraneousRcFiles = extraneousRcFiles;
  }

  setToken(token) {
    this.token = token;
  }

  setOtp(otp) {
    this.otp = otp;
  }

  getOption(key) {
    return this.config[key];
  }

  getAvailableRegistries() {
    const config = this.config;
    return Object.keys(config).reduce((registries, option) => {
      if (option === 'registry' || option.split(':')[1] === 'registry') registries.push(config[option]);

      return registries;
    }, []);
  }

  loadConfig() {
    return Promise.resolve();
  }

  checkOutdated(config, name, range) {
    return Promise.reject(new Error('unimplemented'));
  }

  saveHomeConfig(config) {
    return Promise.reject(new Error('unimplemented'));
  }

  request(pathname, opts = {}) {
    return this.requestManager.request({url: pathname, ...opts});
  }

  async init(overrides = {}) {
    this.mergeEnv('yarn_');
    await this.loadConfig();

    for (const override of Object.keys(overrides)) {
      const val = overrides[override];

      if (val !== void 0) this.config[override] = val;
    }
    this.loc = path.join(this.cwd, this.folder);
  }

  static normalizeConfig(config) {
    for (const key in config) config[key] = BaseRegistry.normalizeConfigOption(config[key]);

    return config;
  }

  static normalizeConfigOption(val) {
    return val === 'true' || (val !== 'false' && val);
  }

  mergeEnv(prefix) {
    for (const envKey in process.env) {
      let key = envKey.toLowerCase();

      if (key.indexOf(prefix.toLowerCase()) !== 0) continue;

      const val = BaseRegistry.normalizeConfigOption(process.env[envKey]);

      key = removePrefix(key, prefix.toLowerCase());

      key = key.replace(/__/g, '.');
      key = key.replace(/([^_])_/g, '$1-');

      objectPath.set(this.config, key, val);
    }
  }
}

function getPosixPath(path) {
  return path.replace(/\\/g, '/');
}

function resolveWithHome(path$1) {
  return (process.platform === 'win32' ? /^~(\/|\\)/ : /^~\//).test(path$1)
    ? path.resolve(userHomeDir, path$1.substr(2))
    : path.resolve(path$1);
}

async function getCredentials(config, reporter) {
  let {username, email} = config.registries.yarn.config;

  if (username) reporter.info(`${reporter.lang('npmUsername')}: ${username}`);
  else {
    username = await reporter.question(reporter.lang('npmUsername'));
    if (!username) return null;
  }

  if (email) reporter.info(`${reporter.lang('npmEmail')}: ${email}`);
  else {
    email = await reporter.question(reporter.lang('npmEmail'));
    if (!email) return null;
  }

  await config.registries.yarn.saveHomeConfig({username, email});

  return {username, email};
}

function getOneTimePassword(reporter) {
  return reporter.question(reporter.lang('npmOneTimePassword'));
}

async function getToken(config, reporter, name = '', flags = {}, registry = '') {
  const auth = registry ? config.registries.npm.getAuthByRegistry(registry) : config.registries.npm.getAuth(name);

  config.otp && config.registries.npm.setOtp(config.otp);

  if (auth) {
    config.registries.npm.setToken(auth);
    return function() {
      reporter.info(reporter.lang('notRevokingConfigToken'));
      return Promise.resolve();
    };
  }

  const env = process.env.YARN_AUTH_TOKEN || process.env.NPM_AUTH_TOKEN;
  if (env) {
    config.registries.npm.setToken('Bearer ' + env);
    return function() {
      reporter.info(reporter.lang('notRevokingEnvToken'));
      return Promise.resolve();
    };
  }

  if (flags.nonInteractive || config.nonInteractive) throw new MessageError(reporter.lang('nonInteractiveNoToken'));

  const creds = await getCredentials(config, reporter);
  if (!creds) {
    reporter.warn(reporter.lang('loginAsPublic'));
    return function() {
      reporter.info(reporter.lang('noTokenToRevoke'));
      return Promise.resolve();
    };
  }

  const {username, email} = creds,
    password = await reporter.question(reporter.lang('npmPassword'), {password: true, required: true});

  const userobj = {
    _id: 'org.couchdb.user:' + username,
    name: username,
    password,
    email,
    type: 'user',
    roles: [],
    date: new Date().toISOString(),
  };

  const res = await config.registries.npm.request('-/user/org.couchdb.user:' + encodeURIComponent(username), {
    method: 'PUT',
    registry,
    body: userobj,
    auth: {username, password, email},
  });

  if (res && res.ok) {
    reporter.success(reporter.lang('loggedIn'));

    const token = res.token;
    config.registries.npm.setToken('Bearer ' + token);

    return function() {
      reporter.success(reporter.lang('revokedToken'));
      return config.registries.npm.request('-/user/token/' + token, {method: 'DELETE', registry}).then(noop);
    };
  }

  throw new MessageError(reporter.lang('incorrectCredentials'));
}

function hasWrapper$1(commander, args) {
  return true;
}

function setFlags$1(commander) {
  commander.description('Stores registry username and email.');
}

function run$1(config, reporter, flags, args) {
  return getCredentials(config, reporter).then(noop);
}

var login = {
  __proto__: null,
  getOneTimePassword,
  getToken,
  hasWrapper: hasWrapper$1,
  setFlags: setFlags$1,
  run: run$1,
};

const DEFAULT_REGISTRY = 'https://registry.npmjs.org/',
  REGEX_REGISTRY_ENFORCED_HTTPS = /^https?:\/\/([^\/]+\.)?(yarnpkg\.com|npmjs\.(org|com))(\/|$)/,
  REGEX_REGISTRY_HTTP_PROTOCOL = /^https?:/i,
  REGEX_REGISTRY_PREFIX = /^(https?:)?\/\//i,
  REGEX_REGISTRY_SUFFIX = /registry\/?$/,

  SCOPE_SEPARATOR = '%2f',
  SCOPED_PKG_REGEXP = /(?:^|\/)(@[^\/?]+?)(?=%2f|\/)/;

function getGlobalPrefix() {
  if (process.env.PREFIX) return process.env.PREFIX;
  if (process.platform === 'win32') return path.dirname(process.execPath);

  let prefix = path.dirname(path.dirname(process.execPath));

  if (process.env.DESTDIR) prefix = path.join(process.env.DESTDIR, prefix);

  return prefix;
}

const PATH_CONFIG_OPTIONS = new Set(['cache', 'cafile', 'prefix', 'userconfig']);

function isPathConfigOption(key) {
  return PATH_CONFIG_OPTIONS.has(key);
}

function normalizePath(val) {
  if (val === void 0) return void 0;

  if (typeof val != 'string') val = String(val);

  return resolveWithHome(val);
}

function urlParts(requestUrl) {
  const normalizedUrl = normalizeUrl(requestUrl),
    parsed = url.parse(normalizedUrl);
  return {host: parsed.host || '', path: parsed.path || ''};
}

class NpmRegistry extends BaseRegistry {
  constructor(cwd, registries, requestManager, reporter, enableDefaultRc, extraneousRcFiles) {
    super(cwd, registries, requestManager, reporter, enableDefaultRc, extraneousRcFiles);
    this.folder = 'node_modules';
  }

  static filename = 'package.json';

  static escapeName(name) {
    return name.replace('/', SCOPE_SEPARATOR);
  }

  isScopedPackage(packageIdent) {
    return SCOPED_PKG_REGEXP.test(packageIdent);
  }

  getRequestUrl(registry, pathname) {
    let resolved = pathname;

    REGEX_REGISTRY_PREFIX.test(pathname) || (resolved = url.resolve(addSuffix(registry, '/'), './' + pathname));

    if (REGEX_REGISTRY_ENFORCED_HTTPS.test(resolved)) resolved = resolved.replace(/^http:\/\//, 'https://');

    return resolved;
  }

  isRequestToRegistry(requestUrl, registryUrl) {
    const request = urlParts(requestUrl),
      registry = urlParts(registryUrl),
      customHostSuffix = this.getRegistryOrGlobalOption(registryUrl, 'custom-host-suffix'),

      requestToRegistryHost = request.host === registry.host,
      requestToYarn = YARN_REGISTRY.includes(request.host) && DEFAULT_REGISTRY.includes(registry.host),
      requestToRegistryPath = request.path.startsWith(registry.path),
      customHostSuffixInUse = typeof customHostSuffix == 'string' && request.host.endsWith(customHostSuffix);

    return (requestToRegistryHost || requestToYarn) && (requestToRegistryPath || customHostSuffixInUse);
  }

  async request(pathname, opts = {}, packageName) {
    const packageIdent = (packageName && NpmRegistry.escapeName(packageName)) || pathname,
      registry = opts.registry || this.getRegistry(packageIdent),
      requestUrl = this.getRequestUrl(registry, pathname),

      alwaysAuth = this.getRegistryOrGlobalOption(registry, 'always-auth');

    const headers = {
      Accept: opts.unfiltered
        ? 'application/json'
        : 'application/vnd.npm.install-v1+json; q=1.0, application/json; q=0.8, */*',
      ...opts.headers,
    };

    const isToRegistry = this.isRequestToRegistry(requestUrl, registry) || this.requestNeedsAuth(requestUrl);

    if (this.token || (isToRegistry && (alwaysAuth || this.isScopedPackage(packageIdent)))) {
      const authorization = this.getAuth(packageIdent);
      if (authorization) headers.authorization = authorization;
    }

    if (this.otp) headers['npm-otp'] = this.otp;

    try {
      return await this.requestManager.request({
        url: requestUrl,
        method: opts.method,
        body: opts.body,
        auth: opts.auth,
        headers,
        json: !opts.buffer,
        buffer: opts.buffer,
        process: opts.process,
        gzip: true,
      });
    } catch (error) {
      if (error instanceof OneTimePasswordError) {
        if (this.otp) throw new MessageError(this.reporter.lang('incorrectOneTimePassword'));

        this.reporter.info(this.reporter.lang('twoFactorAuthenticationEnabled'));
        error.notice && this.reporter.info(error.notice);

        this.otp = await getOneTimePassword(this.reporter);

        this.requestManager.clearCache();

        return this.request(pathname, opts, packageName);
      }
      throw error;
    }
  }

  requestNeedsAuth(requestUrl) {
    const config = this.config,
      requestParts = urlParts(requestUrl);
    return !!Object.keys(config).find(option => {
      const parts = option.split(':');
      if ((parts.length === 2 && parts[1] === '_authToken') || parts[1] === '_password') {
        const registryParts = urlParts(parts[0]);
        if (requestParts.host === registryParts.host && requestParts.path.startsWith(registryParts.path))
          return true;
      }
      return false;
    });
  }

  async checkOutdated(config, name, range) {
    const escapedName = NpmRegistry.escapeName(name),
      req = await this.request(escapedName, {unfiltered: true});
    if (!req) throw new Error("couldn't find " + name);

    let {repository, homepage} = req;
    const wantedPkg = await NpmResolver.findVersionInRegistryResponse(config, escapedName, range, req);

    if (!repository && !homepage) {
      repository = wantedPkg.repository;
      homepage = wantedPkg.homepage;
    }

    let latest = req['dist-tags'].latest;
    latest || (latest = wantedPkg.version);

    const url = homepage || (repository && repository.url) || '';

    return {latest, wanted: wantedPkg.version, url};
  }

  async getPossibleConfigLocations(filename, reporter) {
    let possibles = [];

    for (const rcFile of this.extraneousRcFiles.slice().reverse())
      possibles.push([false, path.resolve(process.cwd(), rcFile)]);

    if (this.enableDefaultRc) {
      const localfile = '.' + filename;
      possibles = possibles.concat([
        [false, path.join(this.cwd, localfile)],
        [true, this.config.userconfig || path.join(userHomeDir, localfile)],
        [false, path.join(getGlobalPrefix(), 'etc', filename)],
      ]);

      home === userHomeDir || possibles.push([true, path.join(home, localfile)]);

      for (const foldersFromRootToCwd = getPosixPath(this.cwd).split('/'); foldersFromRootToCwd.length > 1; ) {
        possibles.push([false, path.join(foldersFromRootToCwd.join(path.sep), localfile)]);
        foldersFromRootToCwd.pop();
      }
    }

    const actuals = [];
    for (const [isHome, loc] of possibles) {
      reporter.verbose(reporter.lang('configPossibleFile', loc));
      if (await exists(loc)) {
        reporter.verbose(reporter.lang('configFileFound', loc));
        actuals.push([isHome, loc, await readFile(loc)]);
      }
    }

    return actuals;
  }

  static getConfigEnv(env = process.env) {
    const overrideEnv = {HOME: home};
    return Object.assign({}, env, overrideEnv);
  }

  static normalizeConfig(config) {
    const env = NpmRegistry.getConfigEnv();
    config = BaseRegistry.normalizeConfig(config);

    for (const key in config) {
      config[key] = envReplace(config[key], env);
      if (isPathConfigOption(key)) config[key] = normalizePath(config[key]);
    }

    return config;
  }

  async loadConfig() {
    this.mergeEnv('npm_config_');

    for (const [, loc, file] of await this.getPossibleConfigLocations('npmrc', this.reporter)) {
      const config = NpmRegistry.normalizeConfig(ini.parse(file)),

        offlineLoc = config['yarn-offline-mirror'];
      if (!this.config['yarn-offline-mirror'] && offlineLoc) {
        const mirrorLoc = (config['yarn-offline-mirror'] = path.resolve(path.dirname(loc), offlineLoc));
        await mkdirp(mirrorLoc);
      }

      this.config = Object.assign({}, config, this.config);
    }
  }

  getScope(packageIdent) {
    const match = packageIdent.match(SCOPED_PKG_REGEXP);
    return (match && match[1]) || '';
  }

  getRegistry(packageIdent) {
    if (packageIdent.match(REGEX_REGISTRY_PREFIX)) {
      const registry = this.getAvailableRegistries().find(registry => packageIdent.startsWith(registry));
      if (registry) return String(registry);
    }

    for (const scope of [this.getScope(packageIdent), '']) {
      const registry =
        this.getScopedOption(scope, 'registry') || this.registries.yarn.getScopedOption(scope, 'registry');
      if (registry) return String(registry);
    }

    return DEFAULT_REGISTRY;
  }

  getAuthByRegistry(registry) {
    const authToken = this.getRegistryOrGlobalOption(registry, '_authToken');
    if (authToken) return 'Bearer ' + String(authToken);

    const auth = this.getRegistryOrGlobalOption(registry, '_auth');
    if (auth) return 'Basic ' + String(auth);

    const username = this.getRegistryOrGlobalOption(registry, 'username'),
      password = this.getRegistryOrGlobalOption(registry, '_password');
    if (username && password) {
      const pw = Buffer.from(String(password), 'base64').toString();
      return 'Basic ' + Buffer.from(String(username) + ':' + pw).toString('base64');
    }

    return '';
  }

  getAuth(packageIdent) {
    if (this.token) return this.token;

    const baseRegistry = this.getRegistry(packageIdent),
      registries = [baseRegistry];

    baseRegistry !== YARN_REGISTRY || registries.push(DEFAULT_REGISTRY);

    for (const registry of registries) {
      const auth = this.getAuthByRegistry(registry);

      if (auth) return auth;
    }

    return '';
  }

  getScopedOption(scope, option) {
    return this.getOption(scope + (scope ? ':' : '') + option);
  }

  getRegistryOption(registry, option) {
    const pre = REGEX_REGISTRY_HTTP_PROTOCOL,
      suf = REGEX_REGISTRY_SUFFIX,

      reg = addSuffix(registry, '/');

    return (
      this.getScopedOption(reg, option) ||
      (pre.test(reg) && this.getRegistryOption(reg.replace(pre, ''), option)) ||
      (suf.test(reg) && this.getRegistryOption(reg.replace(suf, ''), option))
    );
  }

  getRegistryOrGlobalOption(registry, option) {
    return this.getRegistryOption(registry, option) || this.getOption(option);
  }
}

const installationMethod = 'unknown',
  version = '1.22.19';

async function getInstallationMethod() {
  let installationMethod$1 = installationMethod;

  try {
    const manifestPath = path.join(__dirname, '..', 'package.json');
    if (fs.existsSync(manifestPath)) {
      const manifest = await readJson(manifestPath);
      if (manifest.installationMethod) installationMethod$1 = manifest.installationMethod;
    }
  } catch (_) {}
  return installationMethod$1;
}

const DEFAULTS = {
  'version-tag-prefix': 'v',
  'version-git-tag': true,
  'version-commit-hooks': true,
  'version-git-sign': false,
  'version-git-message': 'v%s',

  'init-version': '1.0.0',
  'init-license': 'MIT',

  'save-prefix': '^',
  'bin-links': true,
  'ignore-scripts': false,
  'ignore-optional': false,
  registry: YARN_REGISTRY,
  'strict-ssl': true,
  'user-agent': ['yarn/' + version, 'npm/?', 'node/' + process.version, process.platform, process.arch].join(' '),
};

const RELATIVE_KEYS = ['yarn-offline-mirror', 'cache-folder', 'global-folder', 'offline-cache-folder', 'yarn-path'],
  FOLDER_KEY = ['yarn-offline-mirror', 'cache-folder', 'global-folder', 'offline-cache-folder'];

const npmMap = {
  'version-git-sign': 'sign-git-tag',
  'version-tag-prefix': 'tag-version-prefix',
  'version-git-tag': 'git-tag-version',
  'version-commit-hooks': 'commit-hooks',
  'version-git-message': 'message',
};

class YarnRegistry extends NpmRegistry {
  constructor(cwd, registries, requestManager, reporter, enableDefaultRc, extraneousRcFiles) {
    super(cwd, registries, requestManager, reporter, enableDefaultRc, extraneousRcFiles);

    this.homeConfigLoc = path.join(userHomeDir, '.yarnrc');
    this.homeConfig = {};
  }

  static filename = 'yarn.json';

  getOption(key) {
    let val = this.config[key];

    if (val === void 0) {
      val = this.registries.npm.getOption(npmMap[key]);

      if (val === void 0) {
        val = this.registries.npm.getOption(key);

        if (val === void 0) val = DEFAULTS[key];
      }
    }

    return val;
  }

  async loadConfig() {
    const locations = await this.getPossibleConfigLocations('yarnrc', this.reporter);

    for (const [isHome, loc, file] of locations) {
      const {object: config} = Lockfile.parse(file, loc);

      if (isHome) this.homeConfig = config;

      for (const key of RELATIVE_KEYS) {
        const valueLoc = config[key];

        if (!this.config[key] && valueLoc) {
          const resolvedLoc = (config[key] = path.resolve(path.dirname(loc), valueLoc));

          if (FOLDER_KEY.indexOf(key) >= 0) await mkdirp(resolvedLoc);
        }
      }

      const env = config.env;
      if (env) {
        const existingEnv = this.config.env;
        if (existingEnv) this.config.env = Object.assign({}, env, existingEnv);
      }

      this.config = Object.assign({}, config, this.config);
    }

    this.config = Object.assign({}, DEFAULTS, this.config);
  }

  async saveHomeConfig(config) {
    YarnRegistry.normalizeConfig(config);

    for (const key in config) {
      const val = config[key];

      if (this.homeConfig[key] === this.config[key]) this.config[key] = val;

      this.homeConfig[key] = config[key];
    }

    await writeFilePreservingEol(this.homeConfigLoc, Lockfile.stringify(this.homeConfig) + '\n');
  }
}

const registries = {npm: NpmRegistry, yarn: YarnRegistry},

  registryNames = Object.keys(registries),

  notYetImplemented = () => Promise.reject(new Error('This command is not implemented yet.'));

function setFlags$2(commander) {
  commander.description('Has not been implemented yet');
}

const {run: run$2, hasWrapper: hasWrapper$2, examples: examples$1} = buildSubCommands(
  'access',
  {
    public: notYetImplemented,
    restricted: notYetImplemented,
    grant: notYetImplemented,
    revoke: notYetImplemented,
    lsPackages: notYetImplemented,
    lsCollaborators: notYetImplemented,
    edit: notYetImplemented,
  },
  [
    'WARNING: This command yet to be implemented.',
    'public [<package>]',
    'restricted [<package>]',
    'grant <read-only|read-write> <scope:team> [<package>]',
    'revoke <scope:team> [<package>]',
    'ls-packages [<user>|<scope>|<scope:team>]',
    'ls-collaborators [<package> [<user>]]',
    'edit [<package>]',
  ]
);

var access$1 = {
  __proto__: null,
  setFlags: setFlags$2,
  run: run$2,
  hasWrapper: hasWrapper$2,
  examples: examples$1,
};

function normalizePattern(pattern) {
  let hasVersion = false,
    range = 'latest',
    name = pattern,

    isScoped = false;
  if (name[0] === '@') {
    isScoped = true;
    name = name.slice(1);
  }

  const parts = name.split('@');
  if (parts.length > 1) {
    name = parts.shift();
    range = parts.join('@');

    range ? (hasVersion = true) : (range = '*');
  }

  if (isScoped) name = '@' + name;

  return {name, range, hasVersion};
}

class WorkspaceLayout {
  constructor(workspaces, config) {
    this.workspaces = workspaces;
    this.config = config;
  }

  getWorkspaceManifest(key) {
    return this.workspaces[key];
  }

  getManifestByPattern(pattern) {
    const {name, range} = normalizePattern(pattern),
      workspace = this.getWorkspaceManifest(name);
    return workspace && semver.satisfies(workspace.manifest.version, range, this.config.looseSemver)
      ? workspace
      : null;
  }
}

class YarnResolver extends NpmResolver {}

function explodeHashedUrl(url) {
  const parts = url.split('#');

  return {hash: parts[1] || '', url: parts[0]};
}

function cleanup(name) {
  return (name = name.replace(/-\d+\.\d+\.\d+/, '')).replace(/\.git$|\.zip$|\.tar\.gz$|\.tar\.bz2$/, '');
}

function guessNameFallback(source) {
  const parts = source.split('/');
  return cleanup(parts[parts.length - 1]);
}

function guessName(source) {
  try {
    const parsed = url.parse(source);

    if (!parsed.pathname) return guessNameFallback(source);

    const parts = parsed.pathname.split('/');

    for (const part of parts) if (part.match(/\.git$/)) return cleanup(part);

    return parsed.host == null
      ? cleanup(parts[parts.length - 1])
      : parts.length > 2
      ? cleanup(parts[2])
      : parts.length > 1
      ? cleanup(parts[1])
      : guessNameFallback(source);
  } catch (_e) {
    return guessNameFallback(source);
  }
}

class ExoticResolver extends BaseResolver {
  static isVersion(pattern) {
    const proto = this.protocol;
    if (proto) return pattern.startsWith(proto + ':');

    throw new Error('No protocol specified');
  }
}

const queue$1 = new BlockingQueue('child', CHILD_CONCURRENCY);

let uid = 0;

//promisify(child.exec);

function validate(program, opts = {}) {
  if (!program.match(/[\\\/]/) && process.platform === 'win32' && process.env.PATHEXT) {
    const cwd = opts.cwd || process.cwd(),
      pathext = process.env.PATHEXT;

    for (const ext of pathext.split(';')) {
      const candidate = path.join(cwd, `${program}${ext}`);
      if (fs.existsSync(candidate)) throw new Error(`Potentially dangerous call to "${program}" in ${cwd}`);
    }
  }
}

function forkp(program, args, opts) {
  validate(program, opts);
  const key = String(++uid);
  return new Promise((resolve, reject) => {
    const proc = child.fork(program, args, opts);
    spawnedProcesses[key] = proc;

    proc.on('error', error => {
      reject(error);
    });

    proc.on('close', exitCode => {
      resolve(exitCode);
    });
  });
}

function spawnp(program, args, opts) {
  validate(program, opts);
  const key = String(++uid);
  return new Promise((resolve, reject) => {
    const proc = child.spawn(program, args, opts);
    spawnedProcesses[key] = proc;

    proc.on('error', error => {
      reject(error);
    });

    proc.on('close', exitCode => {
      resolve(exitCode);
    });
  });
}

const spawnedProcesses = {};

function forwardSignalToSpawnedProcesses(signal) {
  for (const key of Object.keys(spawnedProcesses)) spawnedProcesses[key].kill(signal);
}

function spawn(program, args, opts = {}, onData) {
  const key = opts.cwd || String(++uid);
  return queue$1.push(
    key,
    () =>
      new Promise((resolve, reject) => {
        validate(program, opts);

        const proc = child.spawn(program, args, opts);
        spawnedProcesses[key] = proc;

        let processingDone = false,
          processClosed = false,
          err = null,

          stdout = '';

        proc.on('error', err => {
          err.code === 'ENOENT'
            ? reject(new ProcessSpawnError("Couldn't find the binary " + program, err.code, program))
            : reject(err);
        });

        function updateStdout(chunk) {
          stdout += chunk;
          onData && onData(chunk);
        }

        function finish() {
          delete spawnedProcesses[key];
          err ? reject(err) : resolve(stdout.trim());
        }

        if (typeof opts.process == 'function')
          opts.process(proc, updateStdout, reject, function() {
            processClosed ? finish() : (processingDone = true);
          });
        else {
          proc.stderr && proc.stderr.on('data', updateStdout);

          proc.stdout && proc.stdout.on('data', updateStdout);

          processingDone = true;
        }

        proc.on('close', (code, signal) => {
          if (signal || code >= 1) {
            err = new ProcessTermError(
              [
                'Command failed.',
                signal ? 'Exit signal: ' + signal : 'Exit code: ' + code,
                'Command: ' + program,
                'Arguments: ' + args.join(' '),
                `Directory: ${opts.cwd || process.cwd()}`,
                'Output:\n' + stdout.trim(),
              ].join('\n')
            );
            err.EXIT_SIGNAL = signal;
            err.EXIT_CODE = code;
          }

          processingDone || err ? finish() : (processClosed = true);
        });
      })
  );
}

const BATCH_MODE_ARGS = new Map([
  ['ssh', '-oBatchMode=yes'],
  ['plink', '-batch'],
]);

const env = {GIT_ASKPASS: '', GIT_TERMINAL_PROMPT: 0, ...process.env},

  sshCommand = env.GIT_SSH || 'ssh',
  sshExecutable = path.basename(sshCommand.toLowerCase(), '.exe'),
  sshBatchArgs = BATCH_MODE_ARGS.get(sshExecutable);

if (!env.GIT_SSH_COMMAND && sshBatchArgs) {
  env.GIT_SSH_VARIANT = sshExecutable;
  env.GIT_SSH_COMMAND = `"${sshCommand}" ${sshBatchArgs}`;
}

const spawn$1 = (args, opts = {}) => spawn('git', args, {...opts, env}),

  REF_PREFIX = 'refs/',
  REF_TAG_PREFIX = 'refs/tags/',
  REF_BRANCH_PREFIX = 'refs/heads/',
  REF_PR_PREFIX = 'refs/pull/',

  GIT_REF_LINE_REGEXP = /^([a-fA-F0-9]+)\s+(refs\/(?:tags|heads|pull|remotes)\/.*)$/,

  COMMIT_SHA_REGEXP = /^[a-f0-9]{5,40}$/,
  REF_NAME_REGEXP = /^refs\/(tags|heads)\/(.+)$/,

  isCommitSha = (target) => COMMIT_SHA_REGEXP.test(target);

const tryVersionAsGitCommit = ({version, refs, git}) => {
  const lowercaseVersion = version.toLowerCase();
  if (!isCommitSha(lowercaseVersion)) return Promise.resolve(null);

  for (const [ref, sha] of refs.entries())
    if (sha.startsWith(lowercaseVersion)) return Promise.resolve({sha, ref});

  return git.resolveCommit(lowercaseVersion);
};

const tryEmptyVersionAsDefaultBranch = ({version, git}) =>
    version.trim() === '' ? git.resolveDefaultBranch() : Promise.resolve(null),

  tryWildcardVersionAsDefaultBranch = ({version, git}) =>
    version === '*' ? git.resolveDefaultBranch() : Promise.resolve(null);

const tryRef = (refs, ref) => {
  const sha = refs.get(ref);
  return sha ? {sha, ref} : null;
};

const tryVersionAsFullRef = ({version, refs}) => (version.startsWith('refs/') ? tryRef(refs, version) : null),

  tryVersionAsTagName = ({version, refs}) => tryRef(refs, `${REF_TAG_PREFIX}${version}`),

  tryVersionAsPullRequestNo = ({version, refs}) => tryRef(refs, `${REF_PR_PREFIX}${version}`),

  tryVersionAsBranchName = ({version, refs}) => tryRef(refs, `${REF_BRANCH_PREFIX}${version}`),

  tryVersionAsDirectRef = ({version, refs}) => tryRef(refs, `${REF_PREFIX}${version}`);

const computeSemverNames = ({config, refs}) => {
  const names = {tags: [], heads: []};
  for (const ref of refs.keys()) {
    const match = REF_NAME_REGEXP.exec(ref);
    if (!match) continue;

    const [, type, name] = match;
    semver.valid(name, config.looseSemver) && names[type].push(name);
  }
  return names;
};

const findSemver = (version, config, namesList) => config.resolveConstraints(namesList, version);

const tryVersionAsTagSemver = async ({version, config, refs}, names) => {
  const result = await findSemver(version.replace(/^semver:/, ''), config, names.tags);
  return result ? tryRef(refs, `${REF_TAG_PREFIX}${result}`) : null;
};

const tryVersionAsBranchSemver = async ({version, config, refs}, names) => {
  const result = await findSemver(version.replace(/^semver:/, ''), config, names.heads);
  return result ? tryRef(refs, `${REF_BRANCH_PREFIX}${result}`) : null;
};

const tryVersionAsSemverRange = async (options) => {
  const names = computeSemverNames(options);
  return (await tryVersionAsTagSemver(options, names)) || tryVersionAsBranchSemver(options, names);
};

const VERSION_RESOLUTION_STEPS = [
  tryEmptyVersionAsDefaultBranch,
  tryVersionAsGitCommit,
  tryVersionAsFullRef,
  tryVersionAsTagName,
  tryVersionAsPullRequestNo,
  tryVersionAsBranchName,
  tryVersionAsSemverRange,
  tryWildcardVersionAsDefaultBranch,
  tryVersionAsDirectRef,
];

const resolveVersion = async (options) => {
  for (const testFunction of VERSION_RESOLUTION_STEPS) {
    const result = await testFunction(options);
    if (result !== null) return result;
  }
  return null;
};

const parseRefs = (stdout) => {
  const refs = new Map(),

    refLines = stdout.split('\n');

  for (const line of refLines) {
    const match = GIT_REF_LINE_REGEXP.exec(line);

    if (match) {
      const [, sha, tagName] = match,

        name = removeSuffix(tagName, '^{}');

      refs.set(name, sha);
    }
  }

  return refs;
};

function hash(content, type = 'md5') {
  return crypto.createHash(type).update(content).digest('hex');
}

class HashStream extends stream.Transform {
  constructor(options) {
    super(options);
    this._hash = crypto.createHash('sha1');
    this._updated = false;
  }

  _transform(chunk, encoding, callback) {
    this._updated = true;
    this._hash.update(chunk);
    callback(null, chunk);
  }

  getHash() {
    return this._hash.digest('hex');
  }

  test(sum) {
    return this._updated && sum === this.getHash();
  }
}

const GIT_PROTOCOL_PREFIX = 'git+',
  SSH_PROTOCOL = 'ssh:',
  SCP_PATH_PREFIX = '/:',
  FILE_PROTOCOL = 'file:',
  GIT_VALID_REF_LINE_REGEXP = /^([a-fA-F0-9]+|ref)/,

  validRef = line => GIT_VALID_REF_LINE_REGEXP.exec(line),

  supportsArchiveCache = nullify({'github.com': false}),

  handleSpawnError = err => {
    if (err instanceof ProcessSpawnError) throw err;
  };

const SHORTHAND_SERVICES = nullify({
  'github:': parsedUrl => ({
    ...parsedUrl,
    slashes: true,
    auth: 'git',
    protocol: SSH_PROTOCOL,
    host: 'github.com',
    hostname: 'github.com',
    pathname: `/${parsedUrl.hostname}${parsedUrl.pathname}`,
  }),
  'bitbucket:': parsedUrl => ({
    ...parsedUrl,
    slashes: true,
    auth: 'git',
    protocol: SSH_PROTOCOL,
    host: 'bitbucket.com',
    hostname: 'bitbucket.com',
    pathname: `/${parsedUrl.hostname}${parsedUrl.pathname}`,
  }),
});

class Git {
  constructor(config, gitUrl, hash$1) {
    this.supportsArchive = false;
    this.fetched = false;
    this.config = config;
    this.reporter = config.reporter;
    this.hash = hash$1;
    this.ref = hash$1;
    this.gitUrl = gitUrl;
    this.cwd = this.config.getTemp(hash(this.gitUrl.repository));
  }

  static npmUrlToGitUrl(npmUrl) {
    npmUrl = removePrefix(npmUrl, GIT_PROTOCOL_PREFIX);

    let parsed = url.parse(npmUrl);
    const expander = parsed.protocol && SHORTHAND_SERVICES[parsed.protocol];

    if (expander) parsed = expander(parsed);

    if (
      parsed.protocol === SSH_PROTOCOL &&
      parsed.hostname &&
      parsed.path &&
      parsed.path.startsWith(SCP_PATH_PREFIX) &&
      parsed.port === null
    ) {
      const auth = parsed.auth ? parsed.auth + '@' : '',
        pathname = parsed.path.slice(SCP_PATH_PREFIX.length);
      return {
        hostname: parsed.hostname,
        protocol: parsed.protocol,
        repository: `${auth}${parsed.hostname}:${pathname}`,
      };
    }

    let repository = parsed.protocol === FILE_PROTOCOL ? parsed.path : url.format({...parsed, hash: ''});

    return {
      hostname: parsed.hostname || null,
      protocol: parsed.protocol || FILE_PROTOCOL,
      repository: repository || '',
    };
  }

  static async hasArchiveCapability(ref) {
    const hostname = ref.hostname;
    if (ref.protocol !== 'ssh:' || hostname == null) return false;

    if (hostname in supportsArchiveCache) return supportsArchiveCache[hostname];

    try {
      await spawn$1(['archive', '--remote=' + ref.repository, 'HEAD', Date.now() + '']);
      throw new Error();
    } catch (err) {
      handleSpawnError(err);
      const supports = err.message.indexOf('did not match any files') >= 0;
      return (supportsArchiveCache[hostname] = supports);
    }
  }

  static async repoExists(ref) {
    const isLocal = ref.protocol === FILE_PROTOCOL;

    try {
      isLocal
        ? await spawn$1(['show-ref', '-t'], {cwd: ref.repository})
        : await spawn$1(['ls-remote', '-t', ref.repository]);

      return true;
    } catch (err) {
      handleSpawnError(err);
      return false;
    }
  }

  static replaceProtocol(ref, protocol) {
    return {hostname: ref.hostname, protocol, repository: ref.repository.replace(/^(?:git|http):/, protocol)};
  }

  static async secureGitUrl(ref, hash, reporter) {
    if (isCommitSha(hash)) return ref;

    if (ref.protocol === 'git:') {
      const secureUrl = Git.replaceProtocol(ref, 'https:');
      if (await Git.repoExists(secureUrl)) return secureUrl;

      reporter.warn(reporter.lang('downloadGitWithoutCommit', ref.repository));
      return ref;
    }

    if (ref.protocol === 'http:') {
      const secureRef = Git.replaceProtocol(ref, 'https:');
      if (await Git.repoExists(secureRef)) return secureRef;

      reporter.warn(reporter.lang('downloadHTTPWithoutCommit', ref.repository));
      return ref;
    }

    return ref;
  }

  archive(dest) {
    return this.supportsArchive ? this._archiveViaRemoteArchive(dest) : this._archiveViaLocalFetched(dest);
  }

  async _archiveViaRemoteArchive(dest) {
    const hashStream = new HashStream();
    await spawn$1(['archive', '--remote=' + this.gitUrl.repository, this.ref], {
      process(proc, resolve, reject, done) {
        const writeStream = fs.createWriteStream(dest);
        proc.on('error', reject);
        writeStream.on('error', reject);
        writeStream.on('end', done);
        writeStream.on('open', function() {
          proc.stdout.pipe(hashStream).pipe(writeStream);
        });
        writeStream.once('finish', done);
      },
    });
    return hashStream.getHash();
  }

  async _archiveViaLocalFetched(dest) {
    const hashStream = new HashStream();
    await spawn$1(['archive', this.hash], {
      cwd: this.cwd,
      process(proc, resolve, reject, done) {
        const writeStream = fs.createWriteStream(dest);
        proc.on('error', reject);
        writeStream.on('error', reject);
        writeStream.on('open', function() {
          proc.stdout.pipe(hashStream).pipe(writeStream);
        });
        writeStream.once('finish', done);
      },
    });
    return hashStream.getHash();
  }

  clone(dest) {
    return this.supportsArchive ? this._cloneViaRemoteArchive(dest) : this._cloneViaLocalFetched(dest);
  }

  _cloneViaRemoteArchive(dest) {
    return spawn$1(['archive', '--remote=' + this.gitUrl.repository, this.ref], {
      process(proc, update, reject, done) {
        const extractor = tarFs.extract(dest, {dmode: 0o555, fmode: 0o444});
        extractor.on('error', reject);
        extractor.on('finish', done);

        proc.stdout.pipe(extractor);
        proc.on('error', reject);
      },
    }).then(noop);
  }

  _cloneViaLocalFetched(dest) {
    return spawn$1(['archive', this.hash], {
      cwd: this.cwd,
      process(proc, resolve, reject, done) {
        const extractor = tarFs.extract(dest, {dmode: 0o555, fmode: 0o444});

        extractor.on('error', reject);
        extractor.on('finish', done);

        proc.stdout.pipe(extractor);
      },
    }).then(noop);
  }

  fetch() {
    const {gitUrl, cwd} = this;

    return lockQueue.push(gitUrl.repository, async () => {
      if (await exists(cwd)) {
        await spawn$1(['fetch', '--tags'], {cwd});
        await spawn$1(['pull'], {cwd});
      } else await spawn$1(['clone', gitUrl.repository, cwd]);

      this.fetched = true;
    });
  }

  getFile(filename) {
    return this.supportsArchive ? this._getFileFromArchive(filename) : this._getFileFromClone(filename);
  }

  async _getFileFromArchive(filename) {
    try {
      return await spawn$1(['archive', '--remote=' + this.gitUrl.repository, this.ref, filename], {
        process(proc, update, reject, done) {
          const parser = tarStream.extract();

          parser.on('error', reject);
          parser.on('finish', done);

          parser.on('entry', (header, stream, next) => {
            const decoder = new string_decoder.StringDecoder('utf8');
            let fileContent = '';

            stream.on('data', buffer => {
              fileContent += decoder.write(buffer);
            });
            stream.on('end', () => {
              const remaining = decoder.end();
              update(fileContent + remaining);
              next();
            });
            stream.resume();
          });

          proc.stdout.pipe(parser);
        },
      });
    } catch (err) {
      if (err.message.indexOf('did not match any files') >= 0) return false;

      throw err;
    }
  }

  async _getFileFromClone(filename) {
    invariant(this.fetched, 'Repo not fetched');

    try {
      return await spawn$1(['show', `${this.hash}:${filename}`], {cwd: this.cwd});
    } catch (err) {
      handleSpawnError(err);
      return false;
    }
  }

  async init() {
    this.gitUrl = await Git.secureGitUrl(this.gitUrl, this.hash, this.reporter);

    await this.setRefRemote();

    this.ref !== '' && (await Git.hasArchiveCapability(this.gitUrl))
      ? (this.supportsArchive = true)
      : await this.fetch();

    return this.hash;
  }

  async setRefRemote() {
    let stdout =
      this.gitUrl.protocol === FILE_PROTOCOL
        ? await spawn$1(['show-ref', '--tags', '--heads'], {cwd: this.gitUrl.repository})
        : await spawn$1(['ls-remote', '--tags', '--heads', this.gitUrl.repository]);

    const refs = parseRefs(stdout);
    return this.setRef(refs);
  }

  setRefHosted(hostedRefsList) {
    const refs = parseRefs(hostedRefsList);
    return this.setRef(refs);
  }

  async resolveDefaultBranch() {
    const isLocal = this.gitUrl.protocol === FILE_PROTOCOL;

    try {
      let stdout;
      if (isLocal) {
        stdout = await spawn$1(['show-ref', 'HEAD'], {cwd: this.gitUrl.repository});
        const sha = parseRefs(stdout).values().next().value;
        if (sha) return {sha, ref: void 0};

        throw new Error('Unable to find SHA for git HEAD');
      }
      //{
      stdout = await spawn$1(['ls-remote', '--symref', this.gitUrl.repository, 'HEAD']);
      const lines = stdout.split('\n').filter(validRef),
        [, ref] = lines[0].split(/\s+/),
        [sha] = lines[1].split(/\s+/);
      return {sha, ref};
      //}
    } catch (err) {
      handleSpawnError(err);
      const lines = (await spawn$1(['ls-remote', this.gitUrl.repository, 'HEAD'])).split('\n').filter(validRef),
        [sha] = lines[0].split(/\s+/);
      return {sha, ref: void 0};
    }
  }

  async resolveCommit(shaToResolve) {
    try {
      await this.fetch();
      const revListArgs = ['rev-list', '-n', '1', '--no-abbrev-commit', '--format=oneline', shaToResolve],
        stdout = await spawn$1(revListArgs, {cwd: this.cwd}),
        [sha] = stdout.split(/\s+/);
      return {sha, ref: void 0};
    } catch (err) {
      handleSpawnError(err);
      return null;
    }
  }

  async setRef(refs) {
    const {hash: version} = this,

      resolvedResult = await resolveVersion({config: this.config, git: this, version, refs});
    if (!resolvedResult)
      throw new MessageError(
        this.reporter.lang('couldntFindMatch', version, Array.from(refs.keys()).join(','), this.gitUrl.repository)
      );

    this.hash = resolvedResult.sha;
    this.ref = resolvedResult.ref || '';
    return this.hash;
  }
}

const GIT_HOSTS = ['github.com', 'gitlab.com', 'bitbucket.com', 'bitbucket.org'],

  GIT_PATTERN_MATCHERS = [/^git:/, /^git\+.+:/, /^ssh:/, /^https?:.+\.git$/, /^https?:.+\.git#.+/];

class GitResolver extends ExoticResolver {
  constructor(request, fragment) {
    super(request, fragment);

    const {url, hash} = explodeHashedUrl(fragment);
    this.url = url;
    this.hash = hash;
  }

  static isVersion(pattern) {
    for (const matcher of GIT_PATTERN_MATCHERS) if (matcher.test(pattern)) return true;

    const {hostname, path} = url.parse(pattern);

    return !!(hostname && path && GIT_HOSTS.indexOf(hostname) >= 0) && path.split('/').filter((p) => !!p).length === 2;
  }

  async resolve(forked) {
    const {url: url$1} = this,
      //parts = url.parse(url$1),

      shrunk = this.request.getLocked('git');
    if (shrunk) return shrunk;

    const {config} = this,

      gitUrl = Git.npmUrlToGitUrl(url$1),
      client = new Git(config, gitUrl, this.hash),
      commit = await client.init();

    async function tryRegistry(registry) {
      const {filename} = registries[registry],

        file = await client.getFile(filename);
      if (!file) return null;

      const json = await config.readJson(`${url$1}/${filename}`, () => JSON.parse(file));
      json._uid = commit;
      json._remote = {resolved: `${url$1}#${commit}`, type: 'git', reference: url$1, hash: commit, registry};
      return json;
    }

    const file = await tryRegistry(this.registry);
    if (file) return file;

    for (const registry in registries) {
      if (registry === this.registry) continue;

      const file = await tryRegistry(registry);
      if (file) return file;
    }

    return {
      name: guessName(url$1),
      version: '0.0.0',
      _uid: commit,
      _remote: {resolved: `${url$1}#${commit}`, type: 'git', reference: url$1, hash: commit, registry: 'npm'},
    };
  }
}

const FILE_PROTOCOL_PREFIX = 'file:';

class FileResolver extends ExoticResolver {
  constructor(request, fragment) {
    super(request, fragment);
    this.loc = removePrefix(fragment, FILE_PROTOCOL_PREFIX);
  }

  static protocol = 'file';
  static prefixMatcher = /^\.{1,2}\//;

  static isVersion(pattern) {
    return super.isVersion.call(this, pattern) || this.prefixMatcher.test(pattern) || path.isAbsolute(pattern);
  }

  async resolve() {
    let loc = this.loc;
    path.isAbsolute(loc) || (loc = path.resolve(this.config.lockfileFolder, loc));

    if (this.config.linkFileDependencies) {
      const registry = 'npm',
        manifest = {_uid: '', name: '', version: '0.0.0', _registry: registry};
      manifest._remote = {type: 'link', registry, hash: null, reference: loc};
      manifest._uid = manifest.version;
      return manifest;
    }
    if (!(await exists(loc)))
      throw new MessageError(this.reporter.lang('doesntExist', loc, this.pattern.split('@')[0]));

    const manifest = await (async () => {
      try {
        return await this.config.readManifest(loc, this.registry);
      } catch (e) {
        if (e.code === 'ENOENT') return {name: path.dirname(loc), version: '0.0.0', _uid: '0.0.0', _registry: 'npm'};

        throw e;
      }
    })();
    const registry = manifest._registry;
    invariant(registry, 'expected registry');

    manifest._remote = {type: 'copy', registry, hash: `${uuid.v4()}-${new Date().getTime()}`, reference: loc};

    manifest._uid = manifest.version;

    return manifest;
  }
}

const LINK_PROTOCOL_PREFIX = 'link:';

class LinkResolver extends ExoticResolver {
  constructor(request, fragment) {
    super(request, fragment);
    this.loc = removePrefix(fragment, LINK_PROTOCOL_PREFIX);
  }

  static protocol = 'link';

  async resolve() {
    let loc = this.loc;
    path.isAbsolute(loc) || (loc = path.resolve(this.config.lockfileFolder, loc));

    const name = path.basename(loc),
      registry = 'npm';

    const manifest =
      (await exists(loc + '/package.json')) && loc !== this.config.lockfileFolder
        ? await this.config.readManifest(loc, this.registry)
        : {_uid: '', name, version: '0.0.0', _registry: registry};

    manifest._remote = {type: 'link', registry, hash: null, reference: loc};

    manifest._uid = manifest.version;

    return manifest;
  }
}

function resolveRelative(info, moduleLoc, lockfileFolder) {
  if (!lockfileFolder) return;

  for (const dependencyType of DEPENDENCY_TYPES) {
    const dependencies = info[dependencyType];
    if (!dependencies) continue;

    for (const name of Object.keys(dependencies)) {
      let prefix,
        value = dependencies[name];

      if (path.isAbsolute(value)) value = FILE_PROTOCOL_PREFIX + value;

      if (value.startsWith(FILE_PROTOCOL_PREFIX)) prefix = FILE_PROTOCOL_PREFIX;
      else if (value.startsWith(LINK_PROTOCOL_PREFIX)) prefix = LINK_PROTOCOL_PREFIX;
      else continue;

      invariant(prefix, 'prefix is definitely defined here');

      const unprefixed = value.substr(prefix.length),
        hasPathPrefix = /^\.(\/|$)/.test(unprefixed),

        absoluteTarget = path.resolve(lockfileFolder, moduleLoc, unprefixed);
      let relativeTarget = path.relative(lockfileFolder, absoluteTarget) || '.';

      if (absoluteTarget === lockfileFolder) relativeTarget = '.';
      else if (hasPathPrefix) relativeTarget = relativeTarget.replace(/^(?!\.{0,2}\/)/, './');

      dependencies[name] = prefix + relativeTarget.replace(/\\/g, '/');
    }
  }
}

const PARENT_PATH = /^\.\.([\\\/]|$)/;

function isValidLicense(license) {
  return !!license && validateLicense(license).validForNewPackages;
}

function isValidBin(bin) {
  return !path.isAbsolute(bin) && !PARENT_PATH.test(path.normalize(bin));
}

function stringifyPerson(person) {
  if (!person || typeof person != 'object') return person;

  const parts = [];
  person.name && parts.push(person.name);

  const email = person.email || person.mail;
  typeof email != 'string' || parts.push(`<${email}>`);

  const url = person.url || person.web;
  typeof url != 'string' || parts.push(`(${url})`);

  return parts.join(' ');
}

function parsePerson(person) {
  if (typeof person != 'string') return person;

  const obj = {};

  let name = person.match(/^([^\(<]+)/);
  if (name) {
    name = name[0].trim();
    if (name) obj.name = name;
  }

  const email = person.match(/<([^>]+)>/);
  if (email) obj.email = email[1];

  const url = person.match(/\(([^\)]+)\)/);
  if (url) obj.url = url[1];

  return obj;
}

function normalizePerson(person) {
  return parsePerson(stringifyPerson(person));
}

function extractDescription(readme) {
  if (typeof readme != 'string' || readme === '') return void 0;

  const lines = readme.trim().split('\n').map((line) => line.trim());

  let start = 0;
  for (; start < lines.length; start++) {
    const line = lines[start];
    if (line && line.match(/^(#|$)/)) {
      start++;
      break;
    }
  }

  while (start < lines.length && !lines[start]) start++;

  let end = start;
  while (end < lines.length && lines[end]) end++;

  return lines.slice(start, end).join(' ');
}

function extractRepositoryUrl(repository) {
  return repository && typeof repository == 'object' ? repository.url : repository;
}

var typos = {
  autohr: 'author',
  autor: 'author',
  contributers: 'contributors',
  depdenencies: 'dependencies',
  dependancies: 'dependencies',
  dependecies: 'dependencies',
  depends: 'dependencies',
  'dev-dependencies': 'devDependencies',
  devDependences: 'devDependencies',
  devDepenencies: 'devDependencies',
  devEependencies: 'devDependencies',
  devdependencies: 'devDependencies',
  hampage: 'homepage',
  hompage: 'homepage',
  prefereGlobal: 'preferGlobal',
  publicationConfig: 'publishConfig',
  repo: 'repository',
  repostitory: 'repository',
  script: 'scripts',
};

var builtinModules = Object.keys(process.binding('natives'))
  .filter(x => !/^_|^internal|\//.test(x) && ['freelist', 'sys'].indexOf(x) < 0)
  .sort();

const moduleSet = new Set(builtinModules);

var isBuiltinModule = moduleName => {
  if (typeof moduleName != 'string') throw new TypeError('Expected a string');

  return moduleSet.has(moduleName);
};

const strings = ['name', 'version'],

  dependencyKeys = ['optionalDependencies', 'dependencies', 'devDependencies'];

function isValidName(name) {
  return !name.match(/[\/@\s\+%:]/) && encodeURIComponent(name) === name;
}

function isValidScopedName(name) {
  if (name[0] !== '@') return false;

  const parts = name.slice(1).split('/');
  return parts.length === 2 && isValidName(parts[0]) && isValidName(parts[1]);
}

function isValidPackageName(name) {
  return isValidName(name) || isValidScopedName(name);
}

function validate$1(info, isRoot, reporter, warn) {
  if (isRoot)
    for (const key in typos) key in info && warn(reporter.lang('manifestPotentialTypo', key, typos[key]));

  const {name} = info;
  if (typeof name == 'string') {
    isRoot && isBuiltinModule(name) && warn(reporter.lang('manifestBuiltinModule', name));

    if (name[0] === '.') throw new MessageError(reporter.lang('manifestNameDot'));

    if (!isValidPackageName(name)) throw new MessageError(reporter.lang('manifestNameIllegalChars'));

    const lower = name.toLowerCase();
    if (lower === 'node_modules' || lower === 'favicon.ico')
      throw new MessageError(reporter.lang('manifestNameBlacklisted'));
  }

  if (isRoot && !info.private)
    typeof info.license == 'string'
      ? isValidLicense(info.license.replace(/\*$/g, '')) || warn(reporter.lang('manifestLicenseInvalid'))
      : warn(reporter.lang('manifestLicenseNone'));

  for (const key of strings) {
    const val = info[key];
    if (val && typeof val != 'string') throw new MessageError(reporter.lang('manifestStringExpected', key));
  }

  cleanDependencies(info, isRoot, reporter, warn);
}

function cleanDependencies(info, isRoot, reporter, warn) {
  const depTypes = [];
  for (const type of dependencyKeys) {
    const deps = info[type];
    deps && typeof deps == 'object' && depTypes.push([type, deps]);
  }

  const nonTrivialDeps = new Map();
  for (const [type, deps] of depTypes)
    for (const name of Object.keys(deps)) {
      const version = deps[name];
      !nonTrivialDeps.has(name) && version && version !== '*' && nonTrivialDeps.set(name, {type, version});
    }

  const setDeps = new Set();
  for (const [type, deps] of depTypes)
    for (const name of Object.keys(deps)) {
      let version = deps[name];

      const dep = nonTrivialDeps.get(name);
      if (dep) {
        version && version !== '*' && version !== dep.version && isRoot &&
          warn(reporter.lang('manifestDependencyCollision', dep.type, name, dep.version, type, version));

        version = dep.version;
      }

      if (setDeps.has(name)) delete deps[name];
      else {
        deps[name] = version;
        setDeps.add(name);
      }
    }
}

var LICENSES = {
  'Apache-2.0': new RegExp(
    '(licensed under the apache license version the license you may not use this file except in compliance with the license you may obtain a copy of the license at http www apache org licenses license unless required by applicable law or agreed to in writing software distributed under the license is distributed on an as is basis without warranties or conditions of any kind either express or implied see the license for the specific language governing permissions and limitations under the license$|apache license version january http www apache org licenses terms and conditions for use reproduction and distribution definitions license shall mean the terms and conditions for use reproduction and distribution as defined by sections through of this document licensor shall mean the copyright owner or entity authorized by the copyright owner that is granting the license legal entity shall mean the union of the acting entity and all other entities that control are controlled by or are under common control with that entity for the purposes of this definition control means i the power direct or indirect to cause the direction or management of such entity whether by contract or otherwise or ii ownership of fifty percent or more of the outstanding shares or iii beneficial ownership of such entity you or your shall mean an individual or legal entity exercising permissions granted by this license source form shall mean the preferred form for making modifications including but not limited to software source code documentation source and configuration files object form shall mean any form resulting from mechanical transformation or translation of a source form including but not limited to compiled object code generated documentation and conversions to other media types work shall mean the work of authorship whether in source or object form made available under the license as indicated by a copyright notice that is included in or attached to the work an example is provided in the appendix below derivative works shall mean any work whether in source or object form that is based on or derived from the work and for which the editorial revisions annotations elaborations or other modifications represent as a whole an original work of authorship for the purposes of this license derivative works shall not include works that remain separable from or merely link or bind by name to the interfaces of the work and derivative works thereof contribution shall mean any work of authorship including the original version of the work and any modifications or additions to that work or derivative works thereof that is intentionally submitted to licensor for inclusion in the work by the copyright owner or by an individual or legal entity authorized to submit on behalf of the copyright owner for the purposes of this definition submitted means any form of electronic verbal or written communication sent to the licensor or its representatives including but not limited to communication on electronic mailing lists source code control systems and issue tracking systems that are managed by or on behalf of the licensor for the purpose of discussing and improving the work but excluding communication that is conspicuously marked or otherwise designated in writing by the copyright owner as not a contribution contributor shall mean licensor and any individual or legal entity on behalf of whom a contribution has been received by licensor and subsequently incorporated within the work grant of copyright license subject to the terms and conditions of this license each contributor hereby grants to you a perpetual worldwide non exclusive no charge royalty free irrevocable copyright license to reproduce prepare derivative works of publicly display publicly perform sublicense and distribute the work and such derivative works in source or object form grant of patent license subject to the terms and conditions of this license each contributor hereby grants to you a perpetual worldwide non exclusive no charge royalty free irrevocable except as stated in this section patent license to make have made use offer to sell sell import and otherwise transfer the work where such license applies only to those patent claims licensable by such contributor that are necessarily infringed by their contribution s alone or by combination of their contribution s with the work to which such contribution s was submitted if you institute patent litigation against any entity including a cross claim or counterclaim in a lawsuit alleging that the work or a contribution incorporated within the work constitutes direct or contributory patent infringement then any patent licenses granted to you under this license for that work shall terminate as of the date such litigation is filed redistribution you may reproduce and distribute copies of the work or derivative works thereof in any medium with or without modifications and in source or object form provided that you meet the following conditions a you must give any other recipients of the work or derivative works a copy of this license and b you must cause any modified files to carry prominent notices stating that you changed the files and c you must retain in the source form of any derivative works that you distribute all copyright patent trademark and attribution notices from the source form of the work excluding those notices that do not pertain to any part of the derivative works and d if the work includes a notice text file as part of its distribution then any derivative works that you distribute must include a readable copy of the attribution notices contained within such notice file excluding those notices that do not pertain to any part of the derivative works in at least one of the following places within a notice text file distributed as part of the derivative works within the source form or documentation if provided along with the derivative works or within a display generated by the derivative works if and wherever such third party notices normally appear the contents of the notice file are for informational purposes only and do not modify the license you may add your own attribution notices within derivative works that you distribute alongside or as an addendum to the notice text from the work provided that such additional attribution notices cannot be construed as modifying the license you may add your own copyright statement to your modifications and may provide additional or different license terms and conditions for use reproduction or distribution of your modifications or for any such derivative works as a whole provided your use reproduction and distribution of the work otherwise complies with the conditions stated in this license submission of contributions unless you explicitly state otherwise any contribution intentionally submitted for inclusion in the work by you to the licensor shall be under the terms and conditions of this license without any additional terms or conditions notwithstanding the above nothing herein shall supersede or modify the terms of any separate license agreement you may have executed with licensor regarding such contributions trademarks this license does not grant permission to use the trade names trademarks service marks or product names of the licensor except as required for reasonable and customary use in describing the origin of the work and reproducing the content of the notice file disclaimer of warranty unless required by applicable law or agreed to in writing licensor provides the work and each contributor provides its contributions on an as is basis without warranties or conditions of any kind either express or implied including without limitation any warranties or conditions of title non infringement merchantability or fitness for a particular purpose you are solely responsible for determining the appropriateness of using or redistributing the work and assume any risks associated with your exercise of permissions under this license limitation of liability in no event and under no legal theory whether in tort including negligence contract or otherwise unless required by applicable law such as deliberate and grossly negligent acts or agreed to in writing shall any contributor be liable to you for damages including any direct indirect special incidental or consequential damages of any character arising as a result of this license or out of the use or inability to use the work including but not limited to damages for loss of goodwill work stoppage computer failure or malfunction or any and all other commercial damages or losses even if such contributor has been advised of the possibility of such damages accepting warranty or additional liability while redistributing the work or derivative works thereof you may choose to offer and charge a fee for acceptance of support warranty indemnity or other liability obligations and or rights consistent with this license however in accepting such obligations you may act only on your own behalf and on your sole responsibility not on behalf of any other contributor and only if you agree to indemnify defend and hold each contributor harmless for any liability incurred by or claims asserted against such contributor by reason of your accepting any such warranty or additional liability end of terms and conditions$)',
    'g'
  ),
  'BSD-2-Clause': new RegExp(
    '(redistribution and use in source and binary forms with or without modification are permitted provided that the following conditions are met redistributions of source code must retain the above copyright notice this list of conditions and the following disclaimer redistributions in binary form must reproduce the above copyright notice this list of conditions and the following disclaimer in the documentation and or other materials provided with the distribution this(.*?| )is provided by the copyright holders and contributors as is and any express or implied warranties including but not limited to the implied warranties of merchantability and fitness for a particular purpose are disclaimed in no event shall(.*?| )be liable for any direct indirect incidental special exemplary or consequential damages including but not limited to procurement of substitute goods or services loss of use data or profits or business interruption however caused and on any theory of liability whether in contract strict liability or tort including negligence or otherwise arising in any way out of the use of this(.*?| )even if advised of the possibility of such damage$|redistribution and use in source and binary forms with or without modification are permitted provided that the following conditions are met redistributions of source code must retain the above copyright notice this list of conditions and the following disclaimer redistributions in binary form must reproduce the above copyright notice this list of conditions and the following disclaimer in the documentation and or other materials provided with the distribution this software is provided by the copyright holders and contributors as is and any express or implied warranties including but not limited to the implied warranties of merchantability and fitness for a particular purpose are disclaimed in no event shall(.*?| )be liable for any direct indirect incidental special exemplary or consequential damages including but not limited to procurement of substitute goods or services loss of use data or profits or business interruption however caused and on any theory of liability whether in contract strict liability or tort including negligence or otherwise arising in any way out of the use of this software even if advised of the possibility of such damage$)',
    'g'
  ),
  'BSD-3-Clause': new RegExp(
    '(redistribution and use in source and binary forms with or without modification are permitted provided that the following conditions are met redistributions of source code must retain the above copyright notice this list of conditions and the following disclaimer redistributions in binary form must reproduce the above copyright notice this list of conditions and the following disclaimer in the documentation and or other materials provided with the distribution neither the name of(.*?| )nor the names of the contributors may be used to endorse or promote products derived from this software without specific prior written permission this software is provided by the copyright holders and contributors as is and any express or implied warranties including but not limited to the implied warranties of merchantability and fitness for a particular purpose are disclaimed in no event shall(.*?| )be liable for any direct indirect incidental special exemplary or consequential damages including but not limited to procurement of substitute goods or services loss of use data or profits or business interruption however caused and on any theory of liability whether in contract strict liability or tort including negligence or otherwise arising in any way out of the use of this software even if advised of the possibility of such damage$|(redistribution and use in source and binary forms with or without modification are permitted provided that the following conditions are met redistributions of source code must retain the above copyright notice this list of conditions and the following disclaimer redistributions in binary form must reproduce the above copyright notice this list of conditions and the following disclaimer in the documentation and or other materials provided with the distribution the names of any contributors may not be used to endorse or promote products derived from this software without specific prior written permission this software is provided by the copyright holders and contributors as is and any express or implied warranties including but not limited to the implied warranties of merchantability and fitness for a particular purpose are disclaimed in no event shall the copyright holders and contributors be liable for any direct indirect incidental special exemplary or consequential damages including but not limited to procurement of substitute goods or services loss of use data or profits or business interruption however caused and on any theory of liability whether in contract strict liability or tort including negligence or otherwise arising in any way out of the use of this software even if advised of the possibility of such damage$|redistribution and use in source and binary forms with or without modification are permitted provided that the following conditions are met redistributions of source code must retain the above copyright notice this list of conditions and the following disclaimer redistributions in binary form must reproduce the above copyright notice this list of conditions and the following disclaimer in the documentation and or other materials provided with the distribution neither the name(.*?| )nor the names of(.*?| )contributors may be used to endorse or promote products derived from this software without specific prior written permission this software is provided by(.*?| )as is and any express or implied warranties including but not limited to the implied warranties of merchantability and fitness for a particular purpose are disclaimed in no event shall(.*?| )be liable for any direct indirect incidental special exemplary or consequential damages including but not limited to procurement of substitute goods or services loss of use data or profits or business interruption however caused and on any theory of liability whether in contract strict liability or tort including negligence or otherwise arising in any way out of the use of this software even if advised of the possibility of such damage$))',
    'g'
  ),
  MIT: new RegExp(
    'permission is hereby granted free of charge to any person obtaining a copy of this software and associated documentation files the software to deal in the software without restriction including without limitation the rights to use copy modify merge publish distribute sublicense and or sell copies of the software and to permit persons to whom the software is furnished to do so subject to the following conditions the above copyright notice and this permission notice shall be included in all copies or substantial portions of the software the software is provided as is without warranty of any kind express or implied including but not limited to the warranties of merchantability fitness for a particular purpose and noninfringement in no event shall the authors or copyright holders be liable for any claim damages or other liability whether in an action of contract tort or otherwise arising from out of or in connection with the software or the use or other dealings in the software$',
    'g'
  ),
  Unlicense: new RegExp(
    'this is free and unencumbered software released into the public domain anyone is free to copy modify publish use compile sell or distribute this software either in source code form or as a compiled binary for any purpose commercial or non commercial and by any means in jurisdictions that recognize copyright laws the author or authors of this software dedicate any and all copyright interest in the software to the public domain we make this dedication for the benefit of the public at large and to the detriment of our heirs and successors we intend this dedication to be an overt act of relinquishment in perpetuity of all present and future rights to this software under copyright law the software is provided as is without warranty of any kind express or implied including but not limited to the warranties of merchantability fitness for a particular purpose and noninfringement in no event shall the authors be liable for any claim damages or other liability whether in an action of contract tort or otherwise arising from out of or in connection with the software or the use or other dealings in the software for more information please refer to wildcard$',
    'g'
  ),
};

function clean$1(str) {
  return str.replace(/[^A-Za-z\s]/g, ' ').replace(/[\s]+/g, ' ').trim().toLowerCase();
}

const REGEXES = {
  Apache: [/Apache License\b/],
  BSD: [/BSD\b/],
  ISC: [/The ISC License/, /ISC\b/],
  MIT: [/MIT\b/],
  Unlicense: [/http:\/\/unlicense.org\//],
  WTFPL: [/DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE/, /WTFPL\b/],
};

function inferLicense(license) {
  const cleanLicense = clean$1(license);
  for (const licenseName in LICENSES) {
    const testLicense = LICENSES[licenseName];
    if (cleanLicense.search(testLicense) >= 0) return licenseName;
  }

  for (const licenseName in REGEXES)
    for (const regex of REGEXES[licenseName]) if (license.search(regex) >= 0) return licenseName + '*';

  return null;
}

const VALID_BIN_KEYS = /^(?!\.{0,2}$)[a-z0-9._-]+$/i,

  LICENSE_RENAMES = {'MIT/X11': 'MIT', X11: 'MIT'};

var fix = async function(info, moduleLoc, reporter, warn, looseSemver) {
  const files = await readdir(moduleLoc);

  if (typeof info.version == 'string') info.version = semver.clean(info.version, looseSemver) || info.version;

  info.name = info.name || '';
  info.version = info.version || '';

  if (typeof info.man == 'string') info.man = [info.man];

  if (typeof info.keywords == 'string') info.keywords = info.keywords.split(/\s+/g);

  if (!info.contributors && files.indexOf('AUTHORS') >= 0) {
    const authorsFilepath = path.join(moduleLoc, 'AUTHORS');
    if ((await stat(authorsFilepath)).isFile()) {
      let authors = await readFile(authorsFilepath);
      authors = authors
        .split(/\r?\n/g)
        .map((line) => line.replace(/^\s*#.*$/, '').trim())
        .filter((line) => !!line);
      info.contributors = authors;
    }
  }

  if (typeof info.author == 'string' || typeof info.author == 'object') info.author = normalizePerson(info.author);

  if (Array.isArray(info.contributors)) info.contributors = info.contributors.map(normalizePerson);
  if (Array.isArray(info.maintainers)) info.maintainers = info.maintainers.map(normalizePerson);

  if (!info.readme) {
    const readmeCandidates = files
      .filter((filename) => {
        const lower = filename.toLowerCase();
        return lower === 'readme' || lower.indexOf('readme.') === 0;
      })
      .sort((filename1, filename2) => filename2.indexOf('.') - filename1.indexOf('.'));

    for (const readmeFilename of readmeCandidates) {
      const readmeFilepath = path.join(moduleLoc, readmeFilename);
      if ((await stat(readmeFilepath)).isFile()) {
        info.readmeFilename = readmeFilename;
        info.readme = await readFile(readmeFilepath);
        break;
      }
    }
  }

  if (!info.description && info.readme) {
    const desc = extractDescription(info.readme);
    if (desc) info.description = desc;
  }

  if (Array.isArray(info.engines)) {
    const engines = {};
    for (const str of info.engines)
      if (typeof str == 'string') {
        const [name, ...patternParts] = str.trim().split(/ +/g);
        engines[name] = patternParts.join(' ');
      }

    info.engines = engines;
  }

  if (typeof info.repository == 'string') info.repository = {type: 'git', url: info.repository};

  const repo = info.repository;

  if (repo && typeof repo == 'object' && typeof repo.url == 'string')
    repo.url = hostedGitFragmentToGitUrl(repo.url, reporter);

  if (typeof info.bugs == 'string') info.bugs = {url: info.bugs};

  if (typeof info.homepage == 'string') {
    const parts = url.parse(info.homepage);
    parts.protocol = parts.protocol || 'http:';
    if (parts.pathname && !parts.hostname) {
      parts.hostname = parts.pathname;
      parts.pathname = '';
    }
    info.homepage = url.format(parts);
  }

  if (typeof info.name == 'string' && typeof info.bin == 'string' && info.bin.length > 0) {
    const name = info.name.replace(/^@[^\/]+\//, '');
    info.bin = {[name]: info.bin};
  }

  if (typeof info.bin == 'object' && info.bin !== null) {
    const bin = info.bin;
    for (const key of Object.keys(bin)) {
      const target = bin[key];
      if (!VALID_BIN_KEYS.test(key) || !isValidBin(target)) {
        delete bin[key];
        warn(reporter.lang('invalidBinEntry', info.name, key));
      } else bin[key] = path.normalize(target);
    }
  } else if (info.bin !== void 0) {
    delete info.bin;
    warn(reporter.lang('invalidBinField', info.name));
  }

  if (info.bundledDependencies) {
    info.bundleDependencies = info.bundledDependencies;
    delete info.bundledDependencies;
  }

  let scripts = info.scripts && typeof info.scripts == 'object' ? info.scripts : {};

  scripts.start || files.indexOf('server.js') < 0 || (scripts.start = 'node server.js');

  scripts.install || files.indexOf('binding.gyp') < 0 || (scripts.install = 'node-gyp rebuild');

  if (Object.keys(scripts).length) info.scripts = scripts;

  const dirs = info.directories;

  if (dirs && typeof dirs == 'object') {
    const binDir = dirs.bin;

    if (!info.bin && binDir && typeof binDir == 'string') {
      const bin = (info.bin = {}),
        fullBinDir = path.join(moduleLoc, binDir);

      if (await exists(fullBinDir)) {
        for (const scriptName of await readdir(fullBinDir))
          if (scriptName[0] !== '.') bin[scriptName] = path.join('.', binDir, scriptName);
      } else warn(reporter.lang('manifestDirectoryNotFound', binDir, info.name));
    }

    const manDir = dirs.man;

    if (!info.man && typeof manDir == 'string') {
      const man = (info.man = []),
        fullManDir = path.join(moduleLoc, manDir);

      if (await exists(fullManDir))
        for (const filename of await readdir(fullManDir))
          /^(.*?)\.\d$/.test(filename) && man.push(path.join('.', manDir, filename));
      else warn(reporter.lang('manifestDirectoryNotFound', manDir, info.name));
    }
  }

  delete info.directories;

  const licenses = info.licenses;
  if (Array.isArray(licenses) && !info.license) {
    let licenseTypes = [];

    for (let license of licenses) {
      if (license && typeof license == 'object') license = license.type;
      typeof license != 'string' || licenseTypes.push(license);
    }

    licenseTypes = licenseTypes.filter(isValidLicense);

    if (licenseTypes.length === 1) info.license = licenseTypes[0];
    else if (licenseTypes.length) info.license = `(${licenseTypes.join(' OR ')})`;
  }

  const license = info.license;

  if (license && typeof license == 'object') info.license = license.type;

  const licenseFile = files.find((filename) => {
    const lower = filename.toLowerCase();
    return (
      lower === 'license' || lower.startsWith('license.') || lower === 'unlicense' || lower.startsWith('unlicense.')
    );
  });
  if (licenseFile) {
    const licenseFilepath = path.join(moduleLoc, licenseFile);
    if ((await stat(licenseFilepath)).isFile()) {
      const licenseContent = await readFile(licenseFilepath),
        inferredLicense = inferLicense(licenseContent);
      info.licenseText = licenseContent;

      const license = info.license;

      if (typeof license == 'string') {
        if (inferredLicense && isValidLicense(inferredLicense) && !isValidLicense(license)) {
          const basicLicense = license.toLowerCase().replace(/(-like|\*)$/g, '');
          if (inferredLicense.toLowerCase().startsWith(basicLicense)) info.license = inferredLicense;
        }
      } else info.license = inferredLicense || 'SEE LICENSE IN ' + licenseFile;
    }
  }

  if (typeof info.license == 'string') info.license = LICENSE_RENAMES[info.license] || info.license;
  else if (typeof info.readme == 'string') {
    const inferredLicense = inferLicense(info.readme);
    if (inferredLicense) info.license = inferredLicense;
  }

  const noticeFile = files.find((filename) => {
    const lower = filename.toLowerCase();
    return lower === 'notice' || lower.startsWith('notice.');
  });
  if (noticeFile) {
    const noticeFilepath = path.join(moduleLoc, noticeFile);
    if ((await stat(noticeFilepath)).isFile()) info.noticeText = await readFile(noticeFilepath);
  }

  for (const dependencyType of MANIFEST_FIELDS) {
    const dependencyList = info[dependencyType];
    if (dependencyList && typeof dependencyList == 'object') {
      delete dependencyList['//'];
      for (const name in dependencyList) dependencyList[name] = dependencyList[name] || '';
    }
  }
};

var normalizeManifest = async function(info, moduleLoc, config, isRoot) {
  const {name, version} = info;
  let human;
  if (typeof name == 'string') human = name;

  if (human && typeof version == 'string' && version) human += '@' + version;

  if (isRoot && info._loc) human = path.relative(config.cwd, info._loc);

  function warn(msg) {
    if (human) msg = `${human}: ${msg}`;

    config.reporter.warn(msg);
  }

  await fix(info, moduleLoc, config.reporter, warn, config.looseSemver);
  resolveRelative(info, moduleLoc, config.lockfileFolder);

  if (config.cwd === config.globalFolder) return info;

  try {
    validate$1(info, isRoot, config.reporter, warn);
  } catch (err) {
    if (human) err.message = `${human}: ${err.message}`;

    throw err;
  }

  return info;
};

const lockPromises = new Map();

var lockMutex = (key) => {
  let unlockNext;
  const willLock = new Promise(resolve => (unlockNext = resolve)),
    lockPromise = lockPromises.get(key) || Promise.resolve(),
    willUnlock = lockPromise.then(() => unlockNext);
  lockPromises.set(key, lockPromise.then(() => willLock));
  return willUnlock;
};

class BaseFetcher {
  constructor(dest, remote, config) {
    this.reporter = config.reporter;
    this.packageName = remote.packageName;
    this.reference = remote.reference;
    this.registry = remote.registry;
    this.hash = remote.hash;
    this.remote = remote;
    this.config = config;
    this.dest = dest;
  }

  setupMirrorFromCache() {
    return Promise.resolve();
  }

  _fetch() {
    return Promise.reject(new Error('Not implemented'));
  }

  fetch(defaultManifest) {
    return lockQueue.push(this.dest, async () => {
      await mkdirp(this.dest);

      const {hash} = await this._fetch();

      const pkg = await (async () => {
        try {
          return await this.config.readManifest(this.dest, this.registry);
        } catch (e) {
          if (e.code === 'ENOENT' && defaultManifest)
            return normalizeManifest(defaultManifest, this.dest, this.config, false);

          throw e;
        }
      })();

      if (pkg.bin)
        for (const binName of Object.keys(pkg.bin)) {
          const binDest = this.dest + '/.bin',

            src = path.resolve(this.dest, pkg.bin[binName]);

          if (await exists(src)) await chmod(src, 0o755);

          await mkdirp(binDest);
          if (process.platform === 'win32') {
            const unlockMutex = await lockMutex(src);
            try {
              await cmdShim.ifExists(src, `${binDest}/${binName}`, {createPwshFile: false});
            } finally {
              unlockMutex();
            }
          } else await symlink(src, `${binDest}/${binName}`);
        }

      await writeFile(
        path.join(this.dest, METADATA_FILENAME),
        JSON.stringify({manifest: pkg, artifacts: [], remote: this.remote, registry: this.registry, hash}, null, '  ')
      );

      return {hash, dest: this.dest, package: pkg, cached: false};
    });
  }
}

const RE_URL_NAME_MATCH = /\/(?:(@[^/]+)(?:\/|%2f))?[^/]+\/(?:-|_attachments)\/(?:@[^/]+\/)?([^/]+)$/;

const isHashAlgorithmSupported = name => {
  const cachedResult = isHashAlgorithmSupported.__cache[name];
  if (cachedResult != null) return cachedResult;

  let supported = true;
  try {
    crypto.createHash(name);
  } catch (error) {
    if (error.message !== 'Digest method not supported') throw error;

    supported = false;
  }

  isHashAlgorithmSupported.__cache[name] = supported;
  return supported;
};
isHashAlgorithmSupported.__cache = {};

class TarballFetcher extends BaseFetcher {
  constructor(dest, remote, config) {
    super(dest, remote, config);

    this.validateError = null;
    this.validateIntegrity = null;
  }

  async setupMirrorFromCache() {
    const tarballMirrorPath = this.getTarballMirrorPath(),
      tarballCachePath = this.getTarballCachePath();

    if (tarballMirrorPath != null && !(await exists(tarballMirrorPath)) && (await exists(tarballCachePath))) {
      await mkdirp(path.dirname(tarballMirrorPath));
      await copy(tarballCachePath, tarballMirrorPath, this.reporter);
    }
  }

  getTarballCachePath() {
    return path.join(this.dest, TARBALL_FILENAME);
  }

  getTarballMirrorPath() {
    const {pathname} = url.parse(this.reference);

    if (pathname == null) return null;

    const match = pathname.match(RE_URL_NAME_MATCH);

    let packageFilename;
    if (match) {
      const [, scope, tarballBasename] = match;
      packageFilename = scope ? `${scope}-${tarballBasename}` : tarballBasename;
    } else packageFilename = path.basename(pathname);

    return this.config.getOfflineMirrorPath(packageFilename);
  }

  createExtractor(resolve, reject, tarballPath) {
    const hashInfo = this._supportedIntegrity({hashOnly: true}),
      integrityInfo = this._supportedIntegrity({hashOnly: false}),

      now = new Date();

    const patchedFs = Object.assign({}, fs, {
      utimes: (path, atime, mtime, cb) => {
        fs.stat(path, (err, stat) => {
          err
            ? cb(err)
            : stat.isDirectory()
            ? fs.utimes(path, atime, mtime, cb)
            : fs.open(path, 'a', (err, fd) => {
                err
                  ? cb(err)
                  : fs.futimes(fd, atime, mtime, err => {
                      err ? fs.close(fd, () => cb(err)) : fs.close(fd, err => cb(err));
                    });
              });
        });
      },
    });

    const hashValidateStream = new ssri.integrityStream(hashInfo),
      integrityValidateStream = new ssri.integrityStream(integrityInfo);

    const untarStream = tarFs.extract(this.dest, {
      strip: 1,
      dmode: 0o755,
      fmode: 0o644,
      chown: false,
      map: header => {
        header.mtime = now;
        if (header.linkname) {
          const basePath = path.posix.dirname(path.join('/', header.name)),
            jailPath = path.posix.join(basePath, header.linkname);
          header.linkname = path.posix.relative('/', jailPath);
        }
        return header;
      },
      fs: patchedFs,
    });
    const extractorStream = gunzip();

    hashValidateStream.once('error', err => {
      this.validateError = err;
    });
    integrityValidateStream.once('error', err => {
      this.validateError = err;
    });
    integrityValidateStream.once('integrity', sri => {
      this.validateIntegrity = sri;
    });

    untarStream.on('error', err => {
      reject(new MessageError(this.config.reporter.lang('errorExtractingTarball', err.message, tarballPath)));
    });

    extractorStream.pipe(untarStream).on('finish', () => {
      const error = this.validateError,
        hexDigest = this.validateIntegrity ? this.validateIntegrity.hexDigest() : '';
      if (
        this.config.updateChecksums &&
        this.remote.integrity &&
        this.validateIntegrity &&
        this.remote.integrity !== this.validateIntegrity.toString()
      )
        this.remote.integrity = this.validateIntegrity.toString();
      else if (this.validateIntegrity) this.remote.cacheIntegrity = this.validateIntegrity.toString();

      if (integrityInfo.integrity && Object.keys(integrityInfo.integrity).length === 0)
        return reject(
          new SecurityError(
            this.config.reporter.lang('fetchBadIntegrityAlgorithm', this.packageName, this.remote.reference)
          )
        );

      if (error) {
        if (!this.config.updateChecksums)
          return reject(
            new SecurityError(
              this.config.reporter.lang(
                'fetchBadHashWithPath',
                this.packageName,
                this.remote.reference,
                error.found.toString(),
                error.expected.toString()
              )
            )
          );

        this.remote.integrity = error.found.toString();
      }

      return resolve({hash: this.hash || hexDigest});
    });

    return {hashValidateStream, integrityValidateStream, extractorStream};
  }

  getLocalPaths(override) {
    return [
      override ? path.resolve(this.config.cwd, override) : null,
      this.getTarballMirrorPath(),
      this.getTarballCachePath(),
    ].filter(path => path != null);
  }

  fetchFromLocal(override) {
    const tarPaths = this.getLocalPaths(override);

    return readFirstAvailableStream(tarPaths).then(stream =>
      new Promise((resolve, reject) => {
        if (!stream) {
          reject(new MessageError(this.reporter.lang('tarballNotInNetworkOrCache', this.reference, tarPaths)));
          return;
        }
        invariant(stream, 'stream should be available at this point');
        const tarballPath = stream.path;
        const {hashValidateStream, integrityValidateStream, extractorStream} = this.createExtractor(
          resolve,
          reject,
          tarballPath
        );

        stream.pipe(hashValidateStream);
        hashValidateStream.pipe(integrityValidateStream);

        integrityValidateStream.pipe(extractorStream).on('error', err => {
          reject(new MessageError(this.config.reporter.lang('fetchErrorCorrupt', err.message, tarballPath)));
        });
      })
    );
  }

  async fetchFromExternal() {
    const registry = this.config.registries[this.registry];

    try {
      const headers = this.requestHeaders();
      return await registry.request(
        this.reference,
        {
          headers: {'Accept-Encoding': 'gzip', ...headers},
          buffer: true,
          process: (req, resolve, reject) => {
            const tarballMirrorPath = this.getTarballMirrorPath(),
              tarballCachePath = this.getTarballCachePath(),

              {hashValidateStream, integrityValidateStream, extractorStream} = this.createExtractor(resolve, reject);

            req.pipe(hashValidateStream);
            hashValidateStream.pipe(integrityValidateStream);

            tarballMirrorPath &&
              integrityValidateStream.pipe(fs.createWriteStream(tarballMirrorPath)).on('error', reject);

            tarballCachePath &&
              integrityValidateStream.pipe(fs.createWriteStream(tarballCachePath)).on('error', reject);

            integrityValidateStream.pipe(extractorStream).on('error', reject);
          },
        },
        this.packageName
      );
    } catch (err) {
      const tarballMirrorPath = this.getTarballMirrorPath(),
        tarballCachePath = this.getTarballCachePath();

      if (tarballMirrorPath && (await exists(tarballMirrorPath))) await unlink(tarballMirrorPath);

      if (tarballCachePath && (await exists(tarballCachePath))) await unlink(tarballCachePath);

      throw err;
    }
  }

  requestHeaders() {
    const config = this.config.registries.yarn.config,
      requestParts = urlParts$1(this.reference);
    return Object.keys(config).reduce((headers, option) => {
      const parts = option.split(':');
      if (parts.length === 3 && parts[1] === '_header') {
        const registryParts = urlParts$1(parts[0]);
        if (requestParts.host === registryParts.host && requestParts.path.startsWith(registryParts.path)) {
          const headerName = parts[2],
            headerValue = config[option];
          headers[headerName] = headerValue;
        }
      }
      return headers;
    }, {});
  }

  _fetch() {
    const isFilePath = this.reference.startsWith('file:');
    this.reference = removePrefix(this.reference, 'file:');
    const urlParse = url.parse(this.reference),

      isRelativePath = urlParse.protocol
        ? urlParse.protocol.match(/^[a-z]:$/i)
        : !!urlParse.pathname && urlParse.pathname.match(/^(?:\.{1,2})?[\\\/]/);

    return isFilePath || isRelativePath
      ? this.fetchFromLocal(this.reference)
      : this.fetchFromLocal().catch(_err => this.fetchFromExternal());
  }

  _findIntegrity({hashOnly}) {
    return this.remote.integrity && !hashOnly
      ? ssri.parse(this.remote.integrity)
      : this.hash
      ? ssri.fromHex(this.hash, 'sha1')
      : null;
  }

  _supportedIntegrity({hashOnly}) {
    const expectedIntegrity = this._findIntegrity({hashOnly}) || {},
      expectedIntegrityAlgorithms = Object.keys(expectedIntegrity),
      shouldValidateIntegrity = (this.hash || this.remote.integrity) && !this.config.updateChecksums;

    if (expectedIntegrityAlgorithms.length === 0 && (!shouldValidateIntegrity || hashOnly))
      return {integrity: null, algorithms: this.config.updateChecksums ? ['sha512'] : ['sha1']};

    const algorithms = new Set(['sha512', 'sha1']),
      integrity = {};
    for (const algorithm of expectedIntegrityAlgorithms)
      if (isHashAlgorithmSupported(algorithm)) {
        algorithms.add(algorithm);
        integrity[algorithm] = expectedIntegrity[algorithm];
      }

    return {integrity, algorithms: Array.from(algorithms)};
  }
}

function urlParts$1(requestUrl) {
  const normalizedUrl = normalizeUrl(requestUrl),
    parsed = url.parse(normalizedUrl);
  return {host: parsed.host || '', path: parsed.path || ''};
}

class TarballResolver extends ExoticResolver {
  constructor(request, fragment) {
    super(request, fragment);

    const {hash, url} = explodeHashedUrl(fragment);
    this.hash = hash;
    this.url = url;
  }

  static isVersion(pattern) {
    return !(
      GitResolver.isVersion(pattern) ||
      (!pattern.startsWith('http://') && !pattern.startsWith('https://') &&
        !(pattern.indexOf('@') < 0 && (pattern.endsWith('.tgz') || pattern.endsWith('.tar.gz'))))
    );
  }

  async resolve() {
    const shrunk = this.request.getLocked('tarball');
    if (shrunk) return shrunk;

    const url = this.url;
    let pkgJson,
      {hash: hash$1, registry} = this;

    const dest = this.config.getTemp(hash(url));

    if (await this.config.isValidModuleDest(dest))
      ({package: pkgJson, hash: hash$1, registry} = await this.config.readPackageMetadata(dest));
    else {
      await unlink(dest);

      const fetcher = new TarballFetcher(dest, {type: 'tarball', reference: url, registry, hash: hash$1}, this.config),

        fetched = await fetcher.fetch({name: guessName(url), version: '0.0.0', _registry: 'npm'});
      pkgJson = fetched.package;
      hash$1 = fetched.hash;

      registry = pkgJson._registry;
      invariant(registry, 'expected registry');
    }

    pkgJson._uid = hash$1;

    pkgJson._remote = {type: 'copy', resolved: `${url}#${hash$1}`, hash: hash$1, registry, reference: dest};

    return pkgJson;
  }
}

function parseHash(fragment) {
  const hashPosition = fragment.indexOf('#');
  return hashPosition < 0 ? '' : fragment.substr(hashPosition + 1);
}

function explodeHostedGitFragment(fragment, reporter) {
  const hash = parseHash(fragment),

    preParts = fragment.split('@');
  if (preParts.length > 2) fragment = preParts[1] + '@' + preParts[2];

  const parts = fragment
    .replace(/(.*?)#.*/, '$1')
    .replace(/.*:(.*)/, '$1')
    .replace(/.git$/, '')
    .split('/');

  const user = parts[parts.length - 2],
    repo = parts[parts.length - 1];

  if (user === void 0 || repo === void 0) throw new MessageError(reporter.lang('invalidHostedGitFragment', fragment));

  return {user, repo, hash};
}

class HostedGitResolver extends ExoticResolver {
  constructor(request, fragment) {
    super(request, fragment);

    const exploded = (this.exploded = explodeHostedGitFragment(fragment, this.reporter)),
      {user, repo, hash} = exploded;
    this.user = user;
    this.repo = repo;
    this.hash = hash;
  }

  static getTarballUrl(exploded, commit) {
    throw new Error('Not implemented');
  }

  static getGitHTTPUrl(exploded) {
    throw new Error('Not implemented');
  }

  static getGitHTTPBaseUrl(exploded) {
    throw new Error('Not implemented');
  }

  static getGitSSHUrl(exploded) {
    throw new Error('Not implemented');
  }

  static getHTTPFileUrl(exploded, filename, commit) {
    throw new Error('Not implemented');
  }

  async getRefOverHTTP(url) {
    const gitUrl = Git.npmUrlToGitUrl(url),
      client = new Git(this.config, gitUrl, this.hash);

    let out = await this.config.requestManager.request({
      url: url + '/info/refs?service=git-upload-pack',
      queue: this.resolver.fetchingQueue,
    });

    if (!out) throw new Error(this.reporter.lang('hostedGitResolveError'));
    //{
    let lines = out.trim().split('\n');

    lines = lines.slice(2);
    lines.pop();

    lines = lines.map((line) => line.slice(4));

    out = lines.join('\n');
    //}

    return client.setRefHosted(out);
  }

  async resolveOverHTTP(url) {
    const commit = await this.getRefOverHTTP(url),
      {config} = this,

      tarballUrl = this.constructor.getTarballUrl(this.exploded, commit);

    const tryRegistry = async (registry) => {
      const {filename} = registries[registry],

        href = this.constructor.getHTTPFileUrl(this.exploded, filename, commit),
        file = await config.requestManager.request({url: href, queue: this.resolver.fetchingQueue});
      if (!file) return null;

      const json = await config.readJson(href, () => JSON.parse(file));
      json._uid = commit;
      json._remote = {resolved: tarballUrl, type: 'tarball', reference: tarballUrl, registry};
      return json;
    };

    const file = await tryRegistry(this.registry);
    if (file) return file;

    for (const registry in registries) {
      if (registry === this.registry) continue;

      const file = await tryRegistry(registry);
      if (file) return file;
    }

    return {
      name: guessName(url),
      version: '0.0.0',
      _uid: commit,
      _remote: {resolved: tarballUrl, type: 'tarball', reference: tarballUrl, registry: 'npm', hash: void 0},
    };
  }

  hasHTTPCapability(url) {
    return this.config.requestManager
      .request({url, method: 'HEAD', queue: this.resolver.fetchingQueue, followRedirect: false})
      .then(res => res !== false);
  }

  async resolve() {
    const shrunk = this.request.getLocked('tarball');
    if (shrunk) return shrunk;

    const httpUrl = this.constructor.getGitHTTPUrl(this.exploded),
      httpBaseUrl = this.constructor.getGitHTTPBaseUrl(this.exploded),
      sshUrl = this.constructor.getGitSSHUrl(this.exploded);

    if (await this.hasHTTPCapability(httpBaseUrl)) return this.resolveOverHTTP(httpUrl);

    const sshGitUrl = Git.npmUrlToGitUrl(sshUrl);
    if (await Git.hasArchiveCapability(sshGitUrl)) {
      const archiveClient = new Git(this.config, sshGitUrl, this.hash),
        commit = await archiveClient.init();
      return this.fork(GitResolver, true, `${sshUrl}#${commit}`);
    }

    return this.fork(GitResolver, true, sshUrl);
  }
}

class GitHubResolver extends HostedGitResolver {
  static protocol = 'github';
  static hostname = 'github.com';

  static isVersion(pattern) {
    return pattern.startsWith('github:') || /^[^:@%/\s.-][^:@%/\s]*[/][^:@\s/%]+(?:#.*)?$/.test(pattern);
  }

  static getTarballUrl(parts, hash) {
    return `https://codeload.${this.hostname}/${parts.user}/${parts.repo}/tar.gz/${hash}`;
  }

  static getGitSSHUrl(parts) {
    return (
      `git+ssh://git@${this.hostname}/${parts.user}/${parts.repo}.git` +
      (parts.hash ? '#' + decodeURIComponent(parts.hash) : '')
    );
  }

  static getGitHTTPBaseUrl(parts) {
    return `https://${this.hostname}/${parts.user}/${parts.repo}`;
  }

  static getGitHTTPUrl(parts) {
    return GitHubResolver.getGitHTTPBaseUrl(parts) + '.git';
  }

  static getHTTPFileUrl(parts, filename, commit) {
    return `https://raw.githubusercontent.com/${parts.user}/${parts.repo}/${commit}/${filename}`;
  }
}

class GitLabResolver extends HostedGitResolver {
  static hostname = 'gitlab.com';
  static protocol = 'gitlab';

  static getTarballUrl(parts, hash) {
    return `https://${this.hostname}/${parts.user}/${parts.repo}/repository/archive.tar.gz?ref=${hash}`;
  }

  static getGitHTTPBaseUrl(parts) {
    return `https://${this.hostname}/${parts.user}/${parts.repo}`;
  }

  static getGitHTTPUrl(parts) {
    return GitLabResolver.getGitHTTPBaseUrl(parts) + '.git';
  }

  static getGitSSHUrl(parts) {
    return (
      `git+ssh://git@${this.hostname}/${parts.user}/${parts.repo}.git` +
      (parts.hash ? '#' + decodeURIComponent(parts.hash) : '')
    );
  }

  static getHTTPFileUrl(parts, filename, commit) {
    return `https://${this.hostname}/${parts.user}/${parts.repo}/raw/${commit}/${filename}`;
  }
}

function explodeGistFragment(fragment, reporter) {
  const parts = (fragment = removePrefix(fragment, 'gist:')).split('#');

  if (parts.length <= 2) return {id: parts[0], hash: parts[1] || ''};

  throw new MessageError(reporter.lang('invalidGistFragment', fragment));
}

class GistResolver extends ExoticResolver {
  static protocol = 'gist';

  constructor(request, fragment) {
    super(request, fragment);

    const {id, hash} = explodeGistFragment(fragment, this.reporter);
    this.id = id;
    this.hash = hash;
  }

  resolve() {
    return this.fork(GitResolver, false, `https://gist.github.com/${this.id}.git#${this.hash}`);
  }
}

class BitbucketResolver extends HostedGitResolver {
  static hostname = 'bitbucket.org';
  static protocol = 'bitbucket';

  static getTarballUrl(parts, hash) {
    return `https://${this.hostname}/${parts.user}/${parts.repo}/get/${hash}.tar.gz`;
  }

  static getGitHTTPBaseUrl(parts) {
    return `https://${this.hostname}/${parts.user}/${parts.repo}`;
  }

  static getGitHTTPUrl(parts) {
    return BitbucketResolver.getGitHTTPBaseUrl(parts) + '.git';
  }

  static getGitSSHUrl(parts) {
    return (
      `git+ssh://git@${this.hostname}/${parts.user}/${parts.repo}.git` +
      (parts.hash ? '#' + decodeURIComponent(parts.hash) : '')
    );
  }

  static getHTTPFileUrl(parts, filename, commit) {
    return `https://${this.hostname}/${parts.user}/${parts.repo}/raw/${commit}/${filename}`;
  }

  hasHTTPCapability(url) {
    return this.config.requestManager
      .request({url, method: 'HEAD', queue: this.resolver.fetchingQueue, followRedirect: false, rejectStatusCode: 302})
      .then(bitbucketHTTPSupport => bitbucketHTTPSupport !== false);
  }
}

class RegistryResolver$1 extends ExoticResolver {
  constructor(request, fragment) {
    super(request, fragment);

    const match = fragment.match(/^(\S+):(@?.*?)(@(.*?)|)$/);
    if (!match) throw new MessageError(this.reporter.lang('invalidFragment', fragment));

    this.range = match[4] || 'latest';
    this.name = match[2];

    this.registry = this.constructor.protocol;
  }

  resolve() {
    return this.fork(this.constructor.factory, false, this.name, this.range);
  }
}

const registries$1 = {npm: NpmResolver, yarn: YarnResolver};

const exotics = new Set([
  GitResolver,
  TarballResolver,
  GitHubResolver,
  FileResolver,
  LinkResolver,
  GitLabResolver,
  GistResolver,
  BitbucketResolver,
]);

function getExoticResolver(pattern) {
  for (const Resolver of exotics) if (Resolver.isVersion(pattern)) return Resolver;

  return null;
}

const hostedGit = {
  github: GitHubResolver,
  gitlab: GitLabResolver,
  bitbucket: BitbucketResolver,
};

function hostedGitFragmentToGitUrl(fragment, reporter) {
  for (const key in hostedGit) {
    const Resolver = hostedGit[key];
    if (Resolver.isVersion(fragment)) return Resolver.getGitHTTPUrl(explodeHostedGitFragment(fragment, reporter));
  }

  return fragment;
}

for (const key in registries$1) {
  const RegistryResolver = registries$1[key];

  exotics.add(
    class extends RegistryResolver$1 {
      static protocol = key;
      static factory = RegistryResolver;
    }
  );
}

const YARN_HOOKS_KEY = 'experimentalYarnHooks';

function callThroughHook(type, fn, context) {
  if (typeof global == 'undefined' || typeof global[YARN_HOOKS_KEY] != 'object' || !global[YARN_HOOKS_KEY])
    return fn();

  const hook = global[YARN_HOOKS_KEY][type];

  return hook ? hook(fn, context) : fn();
}

const integrityErrors = {
  EXPECTED_IS_NOT_A_JSON: 'integrityFailedExpectedIsNotAJSON',
  FILES_MISSING: 'integrityFailedFilesMissing',
  LOCKFILE_DONT_MATCH: 'integrityLockfilesDontMatch',
  FLAGS_DONT_MATCH: 'integrityFlagsDontMatch',
  LINKED_MODULES_DONT_MATCH: 'integrityCheckLinkedModulesDontMatch',
  PATTERNS_DONT_MATCH: 'integrityPatternsDontMatch',
  MODULES_FOLDERS_MISSING: 'integrityModulesFoldersMissing',
  SYSTEM_PARAMS_DONT_MATCH: 'integritySystemParamsDontMatch',
};

const INTEGRITY_FILE_DEFAULTS = () => ({
  systemParams: getSystemParams(),
  modulesFolders: [],
  flags: [],
  linkedModules: [],
  topLevelPatterns: [],
  lockfileEntries: {},
  files: [],
});

class InstallationIntegrityChecker {
  constructor(config) {
    this.config = config;
  }

  _getModulesRootFolder() {
    return this.config.modulesFolder
      ? this.config.modulesFolder
      : this.config.workspaceRootFolder
      ? this.config.workspaceRootFolder
      : path.join(this.config.lockfileFolder, NODE_MODULES_FOLDER);
  }

  _getIntegrityFileFolder() {
    return this.config.modulesFolder
      ? this.config.modulesFolder
      : this.config.enableMetaFolder
      ? path.join(this.config.lockfileFolder, META_FOLDER)
      : path.join(this.config.lockfileFolder, NODE_MODULES_FOLDER);
  }

  _getIntegrityFileLocation() {
    const locationFolder = this._getIntegrityFileFolder(),
      locationPath = path.join(locationFolder, INTEGRITY_FILENAME);

    return exists(locationPath).then(exists$1 => ({locationFolder, locationPath, exists: exists$1}));
  }

  _getModulesFolders({workspaceLayout} = {}) {
    const locations = [];

    this.config.modulesFolder
      ? locations.push(this.config.modulesFolder)
      : locations.push(path.join(this.config.lockfileFolder, NODE_MODULES_FOLDER));

    if (workspaceLayout)
      for (const workspaceName of Object.keys(workspaceLayout.workspaces)) {
        const loc = workspaceLayout.workspaces[workspaceName].loc;

        loc && locations.push(path.join(loc, NODE_MODULES_FOLDER));
      }

    return locations.sort(sortAlpha);
  }

  async _getIntegrityListing({workspaceLayout} = {}) {
    const files = [];

    const recurse = async dir => {
      for (const file of await readdir(dir)) {
        const entry = path.join(dir, file);

        (await lstat$1(entry)).isDirectory() ? await recurse(entry) : files.push(entry);
      }
    };

    for (const modulesFolder of this._getModulesFolders({workspaceLayout}))
      if (await exists(modulesFolder)) await recurse(modulesFolder);

    return files;
  }

  async _generateIntegrityFile(lockfile, patterns, flags, workspaceLayout, artifacts) {
    const result = {...INTEGRITY_FILE_DEFAULTS(), artifacts};

    result.topLevelPatterns = patterns;

    if (workspaceLayout) {
      result.topLevelPatterns = result.topLevelPatterns.filter(p => !workspaceLayout.getManifestByPattern(p));

      for (const name of Object.keys(workspaceLayout.workspaces)) {
        if (!workspaceLayout.workspaces[name].loc) continue;

        const manifest = workspaceLayout.workspaces[name].manifest;

        if (manifest)
          for (const dependencyType of DEPENDENCY_TYPES) {
            const dependencies = manifest[dependencyType];

            if (dependencies)
              for (const dep of Object.keys(dependencies)) result.topLevelPatterns.push(`${dep}@${dependencies[dep]}`);
          }
      }
    }

    result.topLevelPatterns.sort(sortAlpha);

    flags.checkFiles && result.flags.push('checkFiles');

    flags.flat && result.flags.push('flat');

    this.config.ignoreScripts && result.flags.push('ignoreScripts');
    this.config.focus && result.flags.push('focus: ' + this.config.focusedWorkspaceName);

    this.config.production && result.flags.push('production');

    this.config.plugnplayEnabled && result.flags.push('plugnplay');

    const linkedModules = this.config.linkedModules;

    if (linkedModules.length) result.linkedModules = linkedModules.sort(sortAlpha);

    for (const key of Object.keys(lockfile)) result.lockfileEntries[key] = lockfile[key].resolved || '';

    for (const modulesFolder of this._getModulesFolders({workspaceLayout}))
      if (await exists(modulesFolder))
        result.modulesFolders.push(path.relative(this.config.lockfileFolder, modulesFolder));

    if (flags.checkFiles) {
      const modulesRoot = this._getModulesRootFolder();

      result.files = (await this._getIntegrityListing({workspaceLayout}))
        .map(entry => path.relative(modulesRoot, entry))
        .sort(sortAlpha);
    }

    return result;
  }

  async _getIntegrityFile(locationPath) {
    const expectedRaw = await readFile(locationPath);
    try {
      return {...INTEGRITY_FILE_DEFAULTS(), ...JSON.parse(expectedRaw)};
    } catch (_) {}
    return null;
  }

  _compareIntegrityFiles(actual, expected, checkFiles, workspaceLayout) {
    if (!expected) return 'EXPECTED_IS_NOT_A_JSON';

    if (!compareSortedArrays(actual.linkedModules, expected.linkedModules)) return 'LINKED_MODULES_DONT_MATCH';

    if (actual.systemParams !== expected.systemParams) return 'SYSTEM_PARAMS_DONT_MATCH';

    let relevantExpectedFlags = expected.flags.slice();

    if (actual.flags.indexOf('checkFiles') < 0)
      relevantExpectedFlags = relevantExpectedFlags.filter(flag => flag !== 'checkFiles');

    if (!compareSortedArrays(actual.flags, relevantExpectedFlags)) return 'FLAGS_DONT_MATCH';

    if (!compareSortedArrays(actual.topLevelPatterns, expected.topLevelPatterns || [])) return 'PATTERNS_DONT_MATCH';

    for (const key of Object.keys(actual.lockfileEntries))
      if (actual.lockfileEntries[key] !== expected.lockfileEntries[key]) return 'LOCKFILE_DONT_MATCH';

    for (const key of Object.keys(expected.lockfileEntries))
      if (actual.lockfileEntries[key] !== expected.lockfileEntries[key]) return 'LOCKFILE_DONT_MATCH';

    if (checkFiles) {
      if (expected.files.length > actual.files.length) return 'FILES_MISSING';

      for (let u = 0, v = 0; u < expected.files.length; ++u) {
        const max = v + (actual.files.length - v) - (expected.files.length - u) + 1;

        while (v < max && actual.files[v] !== expected.files[u]) v += 1;

        if (v === max) return 'FILES_MISSING';
      }
    }
    return 'OK';
  }

  async check(patterns, lockfile, flags, workspaceLayout) {
    const missingPatterns = patterns.filter(
      p => !(lockfile[p] || (workspaceLayout && workspaceLayout.getManifestByPattern(p)))
    );

    const loc = await this._getIntegrityFileLocation();
    if (missingPatterns.length || !loc.exists) return {integrityFileMissing: !loc.exists, missingPatterns};

    const actual = await this._generateIntegrityFile(lockfile, patterns, flags, workspaceLayout),

      expected = await this._getIntegrityFile(loc.locationPath);
    let integrityMatches = this._compareIntegrityFiles(actual, expected, flags.checkFiles, workspaceLayout);

    if (integrityMatches === 'OK') {
      invariant(expected, "The integrity shouldn't pass without integrity file");
      for (const modulesFolder of expected.modulesFolders)
        (await exists(path.join(this.config.lockfileFolder, modulesFolder))) ||
          (integrityMatches = 'MODULES_FOLDERS_MISSING');
    }

    return {
      integrityFileMissing: false,
      integrityMatches: integrityMatches === 'OK',
      integrityError: integrityMatches === 'OK' ? void 0 : integrityMatches,
      missingPatterns,
      hardRefreshRequired: integrityMatches === 'SYSTEM_PARAMS_DONT_MATCH',
    };
  }

  async getArtifacts() {
    const loc = await this._getIntegrityFileLocation();
    if (!loc.exists) return null;

    const expectedRaw = await readFile(loc.locationPath);
    let expected;
    try {
      expected = JSON.parse(expectedRaw);
    } catch (_) {}

    return expected ? expected.artifacts : null;
  }

  async save(patterns, lockfile, flags, workspaceLayout, artifacts) {
    const integrityFile = await this._generateIntegrityFile(lockfile, patterns, flags, workspaceLayout, artifacts),

      loc = await this._getIntegrityFileLocation();
    invariant(loc.locationPath, 'expected integrity hash location');

    await mkdirp(path.dirname(loc.locationPath));
    await writeFile(loc.locationPath, JSON.stringify(integrityFile, null, 2));
  }

  async removeIntegrityFile() {
    const loc = await this._getIntegrityFileLocation();
    if (loc.exists) await unlink(loc.locationPath);
  }
}

class CopyFetcher extends BaseFetcher {
  async _fetch() {
    await copy(this.reference, this.dest, this.reporter);
    return {hash: this.hash || '', resolved: null};
  }
}

const dynamicRequire = typeof __webpack_require__ != 'undefined' ? __non_webpack_require__ : require;

async function makePortableProxyScriptUnix(source, destination, options) {
  const environment = options.extraEnvironment
    ? Array.from(options.extraEnvironment.entries()).map(([key, value]) => `${key}="${value}" `).join('')
    : '';

  const prependedArguments = options.prependArguments
    ? ' ' + options.prependArguments.map(arg => `"${arg}"`).join(' ')
    : '';
  const appendedArguments = options.appendArguments
    ? ' ' + options.appendArguments.map(arg => `"${arg}"`).join(' ')
    : '';

  const filePath = `${destination}/${options.proxyBasename || path.basename(source)}`,

    sourcePath = path.isAbsolute(source) ? source : '$(dirname "$0")/../' + source;

  await mkdirp(destination);

  if (process.platform === 'win32')
    await writeFile(
      filePath + '.cmd',
      `@${environment}"${sourcePath}" ${prependedArguments} ${appendedArguments} %*\r\n`
    );
  else {
    await writeFile(
      filePath,
      `#!/bin/sh\n\n${environment}exec "${sourcePath}"${prependedArguments} "$@"${appendedArguments}\n`
    );
    await chmod(filePath, 0o755);
  }
}

function makePortableProxyScript(source, destination, options = {}) {
  return makePortableProxyScriptUnix(source, destination, options);
}

function fixCmdWinSlashes(cmd) {
  function findQuotes(quoteSymbol) {
    const quotes = [];
    const addQuote = (_, index) => {
      quotes.push({from: index, to: index + _.length});
      return _;
    };
    const regEx = new RegExp(quoteSymbol + '.*' + quoteSymbol);
    cmd.replace(regEx, addQuote);
    return quotes;
  }
  const quotes = findQuotes('"').concat(findQuotes("'"));

  function isInsideQuotes(index) {
    return quotes.some(quote => quote.from <= index && index <= quote.to);
  }

  const regExp = /((?:^|&&|&|\|\||\|)\s*)(".*?"|'.*?'|\S*)/g;
  return cmd.replace(regExp, (whole, pre, cmd, index) =>
    (pre[0] === '&' || pre[0] === '|') && isInsideQuotes(index) ? whole : pre + cmd.replace(/\//g, '\\')
  );
}

const IGNORE_MANIFEST_KEYS = new Set(['readme', 'notice', 'licenseText', 'activationEvents', 'contributes']),

  IGNORE_CONFIG_KEYS = ['lastUpdateCheck'];

let wrappersFolder = null;

async function getWrappersFolder(config) {
  if (wrappersFolder) return wrappersFolder;

  wrappersFolder = await makeTempDir();

  await makePortableProxyScript(process.execPath, wrappersFolder, {proxyBasename: 'node'});

  await makePortableProxyScript(process.execPath, wrappersFolder, {
    proxyBasename: 'yarn',
    prependArguments: [process.argv[1]],
  });

  return wrappersFolder;
}

const INVALID_CHAR_REGEX = /\W/g;

async function makeEnv(stage, cwd, config) {
  const env = {NODE: process.execPath, INIT_CWD: process.cwd(), ...process.env},

    customEnv = config.getOption('env');
  customEnv && typeof customEnv == 'object' && Object.assign(env, customEnv);

  env.npm_lifecycle_event = stage;
  env.npm_node_execpath = env.NODE;
  env.npm_execpath = env.npm_execpath || (process.mainModule && process.mainModule.filename);

  if (config.production) env.NODE_ENV = 'production';

  env.npm_config_argv = JSON.stringify({
    remain: [],
    cooked: config.commandName === 'run' ? [config.commandName, stage] : [config.commandName],
    original: process.argv.slice(2),
  });

  const manifest = await config.maybeReadManifest(cwd);
  if (manifest) {
    if (manifest.scripts && Object.prototype.hasOwnProperty.call(manifest.scripts, stage))
      env.npm_lifecycle_script = manifest.scripts[stage];

    for (const queue = [['', manifest]]; queue.length; ) {
      const [key, val] = queue.pop();
      if (typeof val == 'object')
        for (const subKey in val) {
          const fullKey = [key, subKey].filter(Boolean).join('_');
          !fullKey || fullKey[0] === '_' || IGNORE_MANIFEST_KEYS.has(fullKey) || queue.push([fullKey, val[subKey]]);
        }
      else {
        let cleanVal = String(val);
        if (cleanVal.indexOf('\n') >= 0) cleanVal = JSON.stringify(cleanVal);

        env['npm_package_' + key.replace(INVALID_CHAR_REGEX, '_')] = cleanVal;
      }
    }
  }

  const keys = new Set([...Object.keys(config.registries.yarn.config), ...Object.keys(config.registries.npm.config)]);
  const cleaned = Array.from(keys)
    .filter(key => !key.match(/:_/) && IGNORE_CONFIG_KEYS.indexOf(key) < 0)
    .map(key => {
      let val = config.getOption(key);
      if (!val) val = '';
      else if (typeof val == 'number') val = '' + val;
      else if (typeof val != 'string') val = JSON.stringify(val);

      if (val.indexOf('\n') >= 0) val = JSON.stringify(val);

      return [key, val];
    });
  for (const [key, val] of cleaned)
    env[`npm_config_${key.replace(/^_+/, '')}`.replace(INVALID_CHAR_REGEX, '_')] = val;

  if (manifest && manifest.name) {
    const packageConfigPrefix = manifest.name + ':';
    for (const [key, val] of cleaned)
      if (key.indexOf(packageConfigPrefix) === 0) {
        const cleanKey = key.replace(/^_+/, '').replace(packageConfigPrefix, '');
        env[`npm_package_config_${cleanKey}`.replace(INVALID_CHAR_REGEX, '_')] = val;
      }
  }

  const envPath = env[ENV_PATH_KEY],
    pathParts = envPath ? envPath.split(path.delimiter) : [];

  pathParts.unshift(path.join(path.dirname(process.execPath), 'node_modules', 'npm', 'bin', 'node-gyp-bin'));
  pathParts.unshift(
    path.join(path.dirname(process.execPath), '..', 'lib', 'node_modules', 'npm', 'bin', 'node-gyp-bin')
  );
  pathParts.unshift(
    path.join(path.dirname(process.execPath), '..', 'libexec', 'lib', 'node_modules', 'npm', 'bin', 'node-gyp-bin')
  );

  const globalBin = await getBinFolder(config, {});
  pathParts.indexOf(globalBin) < 0 && pathParts.unshift(globalBin);

  for (const registryFolder of config.registryFolders) {
    const binFolder = path.join(registryFolder, '.bin');
    config.workspacesEnabled && config.workspaceRootFolder &&
      pathParts.unshift(path.join(config.workspaceRootFolder, binFolder));

    pathParts.unshift(path.join(config.linkFolder, binFolder));
    pathParts.unshift(path.join(cwd, binFolder));
  }

  let pnpFile;

  if (process.versions.pnp) pnpFile = dynamicRequire.resolve('pnpapi');
  else {
    const candidate = `${config.lockfileFolder}/${PNP_FILENAME}`;
    if (await exists(candidate)) pnpFile = candidate;
  }

  if (pnpFile) {
    const pnpApi = dynamicRequire(pnpFile),

      packageLocator = pnpApi.findPackageLocator(cwd + '/'),
      packageInformation = pnpApi.getPackageInformation(packageLocator);

    for (const [name, reference] of packageInformation.packageDependencies.entries()) {
      const dependencyInformation = pnpApi.getPackageInformation({name, reference});

      if (!dependencyInformation || !dependencyInformation.packageLocation) continue;

      const binFolder = dependencyInformation.packageLocation + '/.bin';
      if (await exists(binFolder)) pathParts.unshift(binFolder);
    }

    env.NODE_OPTIONS = env.NODE_OPTIONS || '';
    env.NODE_OPTIONS = `--require ${pnpFile} ${env.NODE_OPTIONS}`;
  }

  config.disableWrappersFolder || pathParts.unshift(await getWrappersFolder());

  env[ENV_PATH_KEY] = pathParts.join(path.delimiter);

  return env;
}

async function executeLifecycleScript({stage, config, cwd, cmd, isInteractive, onProgress, customShell}) {
  const env = await makeEnv(stage, cwd, config);

  await checkForGypIfNeeded(config, cmd, env[ENV_PATH_KEY].split(path.delimiter));

  process.platform !== 'win32' || (customShell && customShell !== 'cmd') || (cmd = fixCmdWinSlashes(cmd));

  let stdio = ['ignore', 'pipe', 'pipe'],
    detached = process.platform !== 'win32';

  if (isInteractive) {
    stdio = 'inherit';
    detached = false;
  }

  const shell = customShell || true;

  return {cwd, command: cmd, stdout: await spawn(cmd, [], {cwd, env, stdio, detached, shell}, onProgress)};
}

let checkGypPromise = null;
function checkForGypIfNeeded(config, cmd, paths) {
  if (cmd.substr(0, cmd.indexOf(' ')) !== 'node-gyp') return Promise.resolve();

  checkGypPromise || (checkGypPromise = _checkForGyp(config, paths));

  return checkGypPromise;
}

function _checkForGyp(config, paths) {
  const {reporter} = config;

  return Promise.all(paths.map(dir => exists(path.join(dir, 'node-gyp')))).then(allChecks => {
    if (allChecks.some(Boolean)) return Promise.resolve();

    reporter.info(reporter.lang('packageRequiresNodeGyp'));

    return run$h(config, reporter, {}, ['add', 'node-gyp']).then(noop, e => {
      throw new MessageError(reporter.lang('nodeGypAutoInstallFailed', e.message));
    });
  });
}

async function execFromManifest(config, commandName, cwd) {
  const pkg = await config.maybeReadManifest(cwd);
  if (!pkg || !pkg.scripts) return;

  const cmd = pkg.scripts[commandName];
  if (cmd) await execCommand({stage: commandName, config, cmd, cwd, isInteractive: true});
}

function execCommand({stage, config, cmd, cwd, isInteractive, customShell}) {
  const {reporter} = config;
  //try {
  reporter.command(cmd);
  return executeLifecycleScript({stage, config, cwd, cmd, isInteractive, customShell}).then(noop, err => {
    if (err instanceof ProcessTermError) {
      const formattedError = new ProcessTermError(
        err.EXIT_SIGNAL
          ? reporter.lang('commandFailedWithSignal', err.EXIT_SIGNAL)
          : reporter.lang('commandFailedWithCode', err.EXIT_CODE)
      );
      formattedError.EXIT_CODE = err.EXIT_CODE;
      formattedError.EXIT_SIGNAL = err.EXIT_SIGNAL;
      throw formattedError;
    }

    throw err;
  }); // .then(() => Promise.resolve(),
}

const FALSY_STRINGS = new Set(['0', 'false']);

function boolify(val) {
  return !FALSY_STRINGS.has(val.toString().toLowerCase());
}

function boolifyWithDefault(val, defaultResult) {
  return val === '' || val === null || val === void 0 ? defaultResult : boolify(val);
}

class PackageConstraintResolver {
  constructor(config, reporter) {
    this.reporter = reporter;
    this.config = config;
  }

  reduce(versions, range) {
    return range === 'latest'
      ? Promise.resolve(versions[versions.length - 1])
      : Promise.resolve(semver.maxSatisfying(versions, range, this.config.looseSemver));
  }
}

const IGNORE_INTERFACES = ['lo0', 'awdl0', 'bridge0'],
  LOCAL_IPS = ['127.0.0.1', '::1'];

function isOffline() {
  let interfaces;

  try {
    interfaces = os.networkInterfaces();
  } catch (e) {
    if (e.syscall === 'uv_interface_addresses') return false;

    throw e;
  }

  for (const name in interfaces) {
    if (IGNORE_INTERFACES.indexOf(name) >= 0) continue;

    const addrs = interfaces[name];
    for (const addr of addrs) if (LOCAL_IPS.indexOf(addr.address) < 0) return false;
  }

  return true;
}

dnscache({enable: true, ttl: 300, cachesize: 10});
const successHosts = nullify(),
  controlOffline = isOffline();

class RequestManager {
  constructor(reporter) {
    this.offlineNoRequests = false;
    this._requestCaptureHar = null;
    this._requestModule = null;
    this.offlineQueue = [];
    this.captureHar = false;
    this.httpsProxy = '';
    this.ca = null;
    this.httpProxy = '';
    this.strictSSL = true;
    this.userAgent = '';
    this.reporter = reporter;
    this.running = 0;
    this.queue = [];
    this.cache = {};
    this.max = NETWORK_CONCURRENCY;
    this.maxRetryAttempts = 5;
  }

  setOptions(opts) {
    if (opts.userAgent != null) this.userAgent = opts.userAgent;

    if (opts.offline != null) this.offlineNoRequests = opts.offline;

    if (opts.captureHar != null) this.captureHar = opts.captureHar;

    if (opts.httpProxy != null) this.httpProxy = opts.httpProxy || '';

    opts.httpsProxy === ''
      ? (this.httpsProxy = opts.httpProxy || '')
      : opts.httpsProxy === false
      ? (this.httpsProxy = false)
      : (this.httpsProxy = opts.httpsProxy || '');

    if (opts.strictSSL !== null && opts.strictSSL !== void 0) this.strictSSL = opts.strictSSL;

    if (opts.ca != null && opts.ca.length > 0) this.ca = opts.ca;

    if (opts.networkConcurrency != null) this.max = opts.networkConcurrency;

    if (opts.networkTimeout != null) this.timeout = opts.networkTimeout;

    if (opts.maxRetryAttempts != null) this.maxRetryAttempts = opts.maxRetryAttempts;

    if (opts.cafile != null && opts.cafile != '')
      try {
        const bundle = fs.readFileSync(opts.cafile).toString(),
          hasPemPrefix = block => block.startsWith('-----BEGIN ');
        this.ca = bundle.split(/(-----BEGIN .*\r?\n[^-]+\r?\n--.*)/).filter(hasPemPrefix);
      } catch (err) {
        this.reporter.error('Could not open cafile: ' + err.message);
      }

    if (opts.cert != null) this.cert = opts.cert;

    if (opts.key != null) this.key = opts.key;
  }

  _getRequestModule() {
    if (!this._requestModule) {
      const request = _libs.request;
      if (this.captureHar) {
        this._requestCaptureHar = new RequestCaptureHar(request);
        this._requestModule = this._requestCaptureHar.request.bind(this._requestCaptureHar);
      } else this._requestModule = request;
    }
    return this._requestModule;
  }

  request(params) {
    if (this.offlineNoRequests)
      return Promise.reject(new MessageError(this.reporter.lang('cantRequestOffline', params.url)));

    const cached = this.cache[params.url];
    if (cached) return cached;

    params.method = params.method || 'GET';
    params.forever = true;
    params.retryAttempts = 0;
    params.strictSSL = this.strictSSL;
    params.headers = Object.assign({'User-Agent': this.userAgent}, params.headers);

    const promise = new Promise((resolve, reject) => {
      this.queue.push({params, reject, resolve});
      this.shiftQueue();
    });

    params.process || (this.cache[params.url] = promise);

    return promise;
  }

  clearCache() {
    this.cache = {};
    this._requestCaptureHar == null || this._requestCaptureHar.clear();
  }

  isPossibleOfflineError(err) {
    const {code, hostname} = err;
    if (!code) return false;

    const possibleOfflineChange = !controlOffline && !isOffline();
    return (
      !(code !== 'ENOTFOUND' || !possibleOfflineChange) ||
      !(code !== 'ENOTFOUND' || !hostname || !successHosts[hostname]) ||
      !(code !== 'ENOTFOUND' || !controlOffline) ||
      code === 'ECONNRESET' ||
      code === 'ESOCKETTIMEDOUT' || code === 'ETIMEDOUT'
    );
  }

  queueForRetry(opts) {
    if (opts.retryReason) {
      let containsReason = false;

      for (const queuedOpts of this.offlineQueue)
        if (queuedOpts.retryReason === opts.retryReason) {
          containsReason = true;
          break;
        }

      containsReason || this.reporter.info(opts.retryReason);
    }

    this.offlineQueue.length || this.initOfflineRetry();

    this.offlineQueue.push(opts);
  }

  initOfflineRetry() {
    setTimeout(() => {
      const queue = this.offlineQueue;
      this.offlineQueue = [];
      for (const opts of queue) this.execute(opts);
    }, 3000);
  }

  execute(opts) {
    const {params} = opts,
      {reporter} = this;

    const buildNext = fn => data => {
      fn(data);
      this.running--;
      this.shiftQueue();
    };

    const resolve = buildNext(opts.resolve),

      rejectNext = buildNext(opts.reject);
    const reject = function(err) {
      err.message = `${params.url}: ${err.message}`;
      rejectNext(err);
    };

    const rejectWithoutUrl = function(err) {
      err.message = err.message;
      rejectNext(err);
    };

    const queueForRetry = reason => {
      const attempts = params.retryAttempts || 0;
      if (attempts >= this.maxRetryAttempts - 1 || (opts.params.method && opts.params.method.toUpperCase() !== 'GET'))
        return false;

      params.retryAttempts = attempts + 1;
      typeof params.cleanup != 'function' || params.cleanup();

      opts.retryReason = reason;
      this.queueForRetry(opts);
      return true;
    };

    let calledOnError = false;
    const onError = err => {
      if (calledOnError) return;
      calledOnError = true;

      (this.isPossibleOfflineError(err) && queueForRetry(this.reporter.lang('offlineRetrying'))) || reject(err);
    };

    if (!params.process) {
      const parts = url.parse(params.url);

      params.callback = (err, res, body) => {
        if (err) {
          onError(err);
          return;
        }

        successHosts[parts.hostname] = true;

        this.reporter.verbose(this.reporter.lang('verboseRequestFinish', params.url, res.statusCode));

        if (res.statusCode === 408 || res.statusCode >= 500) {
          const description = `${res.statusCode} ${http.STATUS_CODES[res.statusCode]}`;
          if (queueForRetry(this.reporter.lang('internalServerErrorRetrying', description))) return;

          throw new ResponseError(this.reporter.lang('requestFailed', description), res.statusCode);
        }

        if (res.statusCode === 401 && res.caseless && res.caseless.get('server') === 'GitHub.com') {
          const message = res.body.message + '. If using GITHUB_TOKEN in your env, check that it is valid.';
          rejectWithoutUrl(new Error(this.reporter.lang('unauthorizedResponse', res.caseless.get('server'), message)));
        }

        if (res.statusCode === 401 && res.headers['www-authenticate'])
          if (res.headers['www-authenticate'].split(/,\s*/).map(s => s.toLowerCase()).indexOf('otp') > -1) {
            reject(new OneTimePasswordError(res.headers['npm-notice']));
            return;
          }

        if (body && typeof body.error == 'string') {
          reject(new Error(body.error));
          return;
        }

        if ([400, 401, 404].concat(params.rejectStatusCode || []).indexOf(res.statusCode) > -1) resolve(false);
        else if (res.statusCode >= 400) {
          const errMsg = (body && body.message) || reporter.lang('requestError', params.url, res.statusCode);
          reject(new Error(errMsg));
        } else resolve(body);
      };
    }

    if (params.buffer) params.encoding = null;

    let proxy = this.httpProxy;
    if (params.url.startsWith('https:')) proxy = this.httpsProxy;

    if (proxy) params.proxy = String(proxy);
    else if (proxy === false) params.proxy = '';

    if (this.ca != null) params.ca = this.ca;

    if (this.cert != null) params.cert = this.cert;

    if (this.key != null) params.key = this.key;

    if (this.timeout != null) params.timeout = this.timeout;

    const req = this._getRequestModule()(params);
    this.reporter.verbose(this.reporter.lang('verboseRequestStart', params.method, params.url));

    req.on('error', onError);

    const queue = params.queue;
    queue && req.on('data', queue.stillActive.bind(queue));

    const process = params.process;
    if (process) {
      req.on('response', res => {
        if (res.statusCode >= 200 && res.statusCode < 300) return;

        const description = `${res.statusCode} ${http.STATUS_CODES[res.statusCode]}`;
        reject(new ResponseError(this.reporter.lang('requestFailed', description), res.statusCode));

        req.abort();
      });
      process(req, resolve, reject);
    }
  }

  shiftQueue() {
    if (this.running >= this.max || !this.queue.length) return;

    const opts = this.queue.shift();

    this.running++;
    this.execute(opts);
  }

  saveHar(filename) {
    if (!this.captureHar) throw new Error(this.reporter.lang('requestManagerNotSetupHAR'));

    this._getRequestModule();
    invariant(this._requestCaptureHar != null, 'request-capture-har not setup');
    this._requestCaptureHar.saveHar(filename);
  }
}

function sortObject(object) {
  const sortedObject = {};
  Object.keys(object).sort().forEach(item => {
    sortedObject[item] = object[item];
  });
  return sortedObject;
}

class Config {
  constructor(reporter) {
    this.enableDefaultRc =
    this.extraneousYarnrcFiles =

    this.looseSemver =
    this.offline =
    this.preferOffline =
    this.pruneOfflineMirror =
    this.enableMetaFolder =
    this.enableLockfileVersions =
    this.linkFileDependencies =
    this.ignorePlatform =
    this.binLinks =
    this.updateChecksums =

    this.packBuiltPackages =

    this.linkedModules =

    this.linkFolder =
    this.globalFolder =

    this.networkConcurrency =
    this.childConcurrency =

    this.networkTimeout =

    this.modulesFolder =

    this._cacheRootFolder =
    this.cacheFolder =
    this.tempFolder =

    this.ignoreScripts =
    this.production =

    this.disablePrepublish =

    this.nonInteractive =

    this.plugnplayPersist =
    this.plugnplayEnabled =
    this.plugnplayShebang =
    this.plugnplayBlacklist =
    this.plugnplayUnplugged =
    this.plugnplayPurgeUnpluggedPackages =

    this.workspacesEnabled =
    this.workspacesNohoistEnabled =

    this.offlineCacheFolder =

    this.cwd =
    this.workspaceRootFolder =
    this.lockfileFolder =

    this.registries =
    this.registryFolders =

    this.cache =

    this.commandName =

    this.focus =
    this.focusedWorkspaceName =

    this.autoAddIntegrity =

    this.otp =
    this.packageDateLimit =
    this.disableWrappersFolder = void 0;

    this.constraintResolver = new PackageConstraintResolver(this, reporter);
    this.requestManager = new RequestManager(reporter);
    this.reporter = reporter;
    this._init({});
  }

  getCache(key, factory) {
    return (
      this.cache[key] ||
      (this.cache[key] = factory().catch((err) => {
        this.cache[key] = null;
        throw err;
      }))
    );
  }

  getOption(key, resolve = false) {
    const value = this.registries.yarn.getOption(key);

    return resolve && typeof value == 'string' && value.length ? resolveWithHome(value) : value;
  }

  resolveConstraints(versions, range) {
    return this.constraintResolver.reduce(versions, range);
  }

  async init(opts = {}) {
    this._init(opts);

    this.workspaceRootFolder = await this.findWorkspaceRoot(this.cwd);
    this.lockfileFolder = this.workspaceRootFolder || this.cwd;

    if (this.focus && (!this.workspaceRootFolder || this.cwd === this.workspaceRootFolder))
      throw new MessageError(this.reporter.lang('workspacesFocusRootCheck'));

    if (this.focus) {
      const focusedWorkspaceManifest = await this.readRootManifest();
      this.focusedWorkspaceName = focusedWorkspaceManifest.name;
    }

    this.linkedModules = [];

    let linkedModules;
    try {
      linkedModules = await readdir(this.linkFolder);
    } catch (err) {
      if (err.code !== 'ENOENT') throw err;

      linkedModules = [];
    }

    for (const dir of linkedModules) {
      const linkedPath = path.join(this.linkFolder, dir);

      if (dir[0] === '@') {
        const scopedLinked = await readdir(linkedPath);
        this.linkedModules.push(...scopedLinked.map(scopedDir => path.join(dir, scopedDir)));
      } else this.linkedModules.push(dir);
    }

    for (const key of Object.keys(registries)) {
      const Registry = registries[key],

        extraneousRcFiles = Registry === registries.yarn ? this.extraneousYarnrcFiles : [];

      const registry = new Registry(
        this.cwd,
        this.registries,
        this.requestManager,
        this.reporter,
        this.enableDefaultRc,
        extraneousRcFiles
      );
      await registry.init({registry: opts.registry});

      this.registries[key] = registry;
      this.registryFolders.indexOf(registry.folder) < 0 && this.registryFolders.push(registry.folder);
    }

    if (this.modulesFolder) this.registryFolders = [this.modulesFolder];

    this.networkConcurrency =
      opts.networkConcurrency || Number(this.getOption('network-concurrency')) || NETWORK_CONCURRENCY;

    this.childConcurrency =
      opts.childConcurrency ||
      Number(this.getOption('child-concurrency')) ||
      Number(process.env.CHILD_CONCURRENCY) ||
      CHILD_CONCURRENCY;

    this.networkTimeout = opts.networkTimeout || Number(this.getOption('network-timeout')) || NETWORK_TIMEOUT;

    const httpProxy = opts.httpProxy || this.getOption('proxy'),
      httpsProxy = opts.httpsProxy || this.getOption('https-proxy');
    this.requestManager.setOptions({
      userAgent: String(this.getOption('user-agent')),
      httpProxy: httpProxy !== false && String(httpProxy || ''),
      httpsProxy: httpsProxy !== false && String(httpsProxy || ''),
      strictSSL: Boolean(this.getOption('strict-ssl')),
      ca: Array.prototype.concat(opts.ca || this.getOption('ca') || []).map(String),
      cafile: String(opts.cafile || this.getOption('cafile', true) || ''),
      cert: String(opts.cert || this.getOption('cert') || ''),
      key: String(opts.key || this.getOption('key') || ''),
      networkConcurrency: this.networkConcurrency,
      networkTimeout: this.networkTimeout,
    });

    this.packageDateLimit = opts.packageDateLimit || String(this.getOption('package-date-limit') || '') || null;
    this.disableWrappersFolder = Boolean(this.getOption('disable-wrappers-folder'));

    this.globalFolder = opts.globalFolder || String(this.getOption('global-folder', true));
    if (this.globalFolder === 'undefined') this.globalFolder = GLOBAL_MODULE_DIRECTORY;

    let cacheRootFolder = opts.cacheFolder || this.getOption('cache-folder', true);

    if (!cacheRootFolder) {
      let preferredCacheFolders = PREFERRED_MODULE_CACHE_DIRECTORIES;
      const preferredCacheFolder = opts.preferredCacheFolder || this.getOption('preferred-cache-folder', true);

      if (preferredCacheFolder) preferredCacheFolders = [String(preferredCacheFolder)].concat(preferredCacheFolders);

      const cacheFolderQuery = await getFirstSuitableFolder(
        preferredCacheFolders,
        constants.W_OK | constants.X_OK | constants.R_OK
      );
      for (const skippedEntry of cacheFolderQuery.skipped)
        this.reporter.warn(this.reporter.lang('cacheFolderSkipped', skippedEntry.folder));

      cacheRootFolder = cacheFolderQuery.folder;
      cacheRootFolder && cacheFolderQuery.skipped.length > 0 &&
        this.reporter.warn(this.reporter.lang('cacheFolderSelected', cacheRootFolder));
    }

    if (!cacheRootFolder) throw new MessageError(this.reporter.lang('cacheFolderMissing'));
    this._cacheRootFolder = String(cacheRootFolder);

    const manifest = await this.maybeReadManifest(this.lockfileFolder),

      plugnplayByEnv = this.getOption('plugnplay-override');
    if (plugnplayByEnv != null) {
      this.plugnplayEnabled = plugnplayByEnv !== 'false' && plugnplayByEnv !== '0';
      this.plugnplayPersist = false;
    } else if (opts.enablePnp || opts.disablePnp) {
      this.plugnplayEnabled = !!opts.enablePnp;
      this.plugnplayPersist = true;
    } else if (manifest && manifest.installConfig && manifest.installConfig.pnp) {
      this.plugnplayEnabled = !!manifest.installConfig.pnp;
      this.plugnplayPersist = false;
    } else {
      this.plugnplayEnabled = false;
      this.plugnplayPersist = false;
    }

    if (
      process.platform === 'win32' &&
      path.parse(this._cacheRootFolder).root.toLowerCase() !== path.parse(this.lockfileFolder).root.toLowerCase()
    ) {
      this.plugnplayEnabled && this.reporter.warn(this.reporter.lang('plugnplayWindowsSupport'));

      this.plugnplayEnabled = false;
      this.plugnplayPersist = false;
    }

    this.plugnplayShebang = String(this.getOption('plugnplay-shebang') || '') || '/usr/bin/env node';
    this.plugnplayBlacklist = String(this.getOption('plugnplay-blacklist') || '') || null;

    this.ignoreScripts = opts.ignoreScripts || Boolean(this.getOption('ignore-scripts', false));

    this.workspacesEnabled = this.getOption('workspaces-experimental') !== false;
    this.workspacesNohoistEnabled = this.getOption('workspaces-nohoist-experimental') !== false;

    this.offlineCacheFolder = String(this.getOption('offline-cache-folder') || '') || null;

    this.pruneOfflineMirror = Boolean(this.getOption('yarn-offline-mirror-pruning'));
    this.enableMetaFolder = Boolean(this.getOption('enable-meta-folder'));
    this.enableLockfileVersions = Boolean(this.getOption('yarn-enable-lockfile-versions'));
    this.linkFileDependencies = Boolean(this.getOption('yarn-link-file-dependencies'));
    this.packBuiltPackages = Boolean(this.getOption('experimental-pack-script-packages-in-mirror'));

    this.autoAddIntegrity = !boolifyWithDefault(String(this.getOption('unsafe-disable-integrity-migration')), true);

    this.cacheFolder = path.join(this._cacheRootFolder, 'v' + String(CACHE_VERSION));
    this.tempFolder = opts.tempFolder || path.join(this.cacheFolder, '.tmp');
    await mkdirp(this.cacheFolder);
    await mkdirp(this.tempFolder);

    if (opts.production !== void 0) this.production = Boolean(opts.production);
    else
      this.production =
        Boolean(this.getOption('production')) ||
        (process.env.NODE_ENV === 'production' &&
          process.env.NPM_CONFIG_PRODUCTION !== 'false' &&
          process.env.YARN_PRODUCTION !== 'false');

    if (this.workspaceRootFolder && !this.workspacesEnabled)
      throw new MessageError(this.reporter.lang('workspacesDisabled'));
  }

  _init(opts) {
    this.registryFolders = [];
    this.linkedModules = [];

    this.registries = nullify();
    this.cache = nullify();

    this.cwd = path.resolve(opts.cwd || this.cwd || process.cwd());

    this.looseSemver = opts.looseSemver == null || opts.looseSemver;

    this.commandName = opts.commandName || '';

    this.enableDefaultRc = opts.enableDefaultRc !== false;
    this.extraneousYarnrcFiles = opts.extraneousYarnrcFiles || [];

    this.preferOffline = !!opts.preferOffline;
    this.modulesFolder = opts.modulesFolder;
    this.linkFolder = opts.linkFolder || LINK_REGISTRY_DIRECTORY;
    this.offline = !!opts.offline;
    this.binLinks = !!opts.binLinks;
    this.updateChecksums = !!opts.updateChecksums;
    this.plugnplayUnplugged = [];
    this.plugnplayPurgeUnpluggedPackages = false;

    this.ignorePlatform = !!opts.ignorePlatform;
    this.ignoreScripts = !!opts.ignoreScripts;

    this.disablePrepublish = !!opts.disablePrepublish;

    this.nonInteractive = !!opts.nonInteractive || isCI || !process.stdout.isTTY;

    this.requestManager.setOptions({offline: !!opts.offline && !opts.preferOffline, captureHar: !!opts.captureHar});

    this.focus = !!opts.focus;
    this.focusedWorkspaceName = '';

    this.otp = opts.otp || '';
  }

  generateUniquePackageSlug(pkg) {
    let slug = pkg.name;

    slug = slug.replace(/[^@a-z0-9]+/g, '-');
    slug = slug.replace(/^-+|-+$/g, '');

    slug = pkg.registry ? `${pkg.registry}-${slug}` : 'unknown-' + slug;

    const {hash} = pkg.remote;

    if (pkg.version) slug += '-' + pkg.version;

    if (pkg.uid && pkg.version !== pkg.uid) slug += '-' + pkg.uid;
    else if (hash) slug += '-' + hash;

    if (pkg.remote.integrity) slug += '-integrity';

    return slug;
  }

  generateModuleCachePath(pkg) {
    invariant(this.cacheFolder, 'No package root');
    invariant(pkg, 'Undefined package');

    const slug = this.generateUniquePackageSlug(pkg);
    return path.join(this.cacheFolder, slug, 'node_modules', pkg.name);
  }

  getUnpluggedPath() {
    return path.join(this.lockfileFolder, '.pnp', 'unplugged');
  }

  generatePackageUnpluggedPath(pkg) {
    const slug = this.generateUniquePackageSlug(pkg);
    return path.join(this.getUnpluggedPath(), slug, 'node_modules', pkg.name);
  }

  async listUnpluggedPackageFolders() {
    const unpluggedPackages = new Map(),
      unpluggedPath = this.getUnpluggedPath();

    if (!(await exists(unpluggedPath))) return unpluggedPackages;

    for (const unpluggedName of await readdir(unpluggedPath)) {
      const nmListing = await readdir(path.join(unpluggedPath, unpluggedName, 'node_modules'));
      invariant(nmListing.length === 1, 'A single folder should be in the unplugged directory');

      const target = path.join(unpluggedPath, unpluggedName, 'node_modules', nmListing[0]);
      unpluggedPackages.set(unpluggedName, target);
    }

    return unpluggedPackages;
  }

  executeLifecycleScript(commandName, cwd) {
    return this.ignoreScripts ? Promise.resolve() : execFromManifest(this, commandName, cwd || this.cwd);
  }

  getTemp(filename) {
    invariant(this.tempFolder, 'No temp folder');
    return path.join(this.tempFolder, filename);
  }

  getOfflineMirrorPath(packageFilename) {
    let mirrorPath;

    for (const key of ['npm', 'yarn']) {
      const registry = this.registries[key];
      if (registry == null) continue;

      const registryMirrorPath = registry.config['yarn-offline-mirror'];

      if (registryMirrorPath === false) return null;
      if (registryMirrorPath != null) mirrorPath = registryMirrorPath;
    }

    return mirrorPath == null
      ? null
      : packageFilename == null
      ? mirrorPath
      : path.join(mirrorPath, path.basename(packageFilename));
  }

  isValidModuleDest(dest) {
    return exists(dest).then(e1 =>
      !e1 ? Promise.resolve(false) : exists(path.join(dest, METADATA_FILENAME)).then(e2 => !!e2)
    );
  }

  readPackageMetadata(dir) {
    return this.getCache('metadata-' + dir, async () => {
      const metadata = await this.readJson(path.join(dir, METADATA_FILENAME));

      return {
        package: await this.readManifest(dir, metadata.registry),
        artifacts: metadata.artifacts || [],
        hash: metadata.hash,
        remote: metadata.remote,
        registry: metadata.registry,
      };
    });
  }

  readManifest(dir, priorityRegistry, isRoot = false) {
    return this.getCache('manifest-' + dir, async () => {
      const manifest = await this.maybeReadManifest(dir, priorityRegistry, isRoot);

      if (manifest) return manifest;

      throw new MessageError(this.reporter.lang('couldntFindPackagejson', dir), 'ENOENT');
    });
  }

  async maybeReadManifest(dir, priorityRegistry, isRoot = false) {
    const metadataLoc = path.join(dir, METADATA_FILENAME);

    if (await exists(metadataLoc)) {
      const metadata = await this.readJson(metadataLoc);

      priorityRegistry || (priorityRegistry = metadata.priorityRegistry);

      if (metadata.manifest !== void 0) return metadata.manifest;
    }

    if (priorityRegistry) {
      const file = await this.tryManifest(dir, priorityRegistry, isRoot);
      if (file) return file;
    }

    for (const registry of Object.keys(registries)) {
      if (priorityRegistry === registry) continue;

      const file = await this.tryManifest(dir, registry, isRoot);
      if (file) return file;
    }

    return null;
  }

  readRootManifest() {
    return this.readManifest(this.cwd, 'npm', true);
  }

  async tryManifest(dir, registry, isRoot) {
    const {filename} = registries[registry],
      loc = path.join(dir, filename);
    if (await exists(loc)) {
      const data = await this.readJson(loc);
      data._registry = registry;
      data._loc = loc;
      return normalizeManifest(data, dir, this, isRoot);
    }
    return null;
  }

  async findManifest(dir, isRoot) {
    for (const registry of registryNames) {
      const manifest = await this.tryManifest(dir, registry, isRoot);

      if (manifest) return manifest;
    }

    return null;
  }

  async findWorkspaceRoot(initial) {
    let previous = null,
      current = path.normalize(initial);
    if (!(await exists(current))) throw new MessageError(this.reporter.lang('folderMissing', current));

    do {
      const ws = extractWorkspaces(await this.findManifest(current, true));
      if (ws && ws.packages) {
        const relativePath = path.relative(current, initial);
        return relativePath === '' || micromatch([relativePath], ws.packages).length > 0 ? current : null;
      }

      previous = current;
      current = path.dirname(current);
    } while (current !== previous);

    return null;
  }

  async resolveWorkspaces(root, rootManifest) {
    const workspaces = {};
    if (!this.workspacesEnabled) return workspaces;

    const ws = this.getWorkspaces(rootManifest, true),
      patterns = ws && ws.packages ? ws.packages : [];

    if (!Array.isArray(patterns)) throw new MessageError(this.reporter.lang('workspacesSettingMustBeArray'));

    const registryFilenames = registryNames
        .map(registryName => this.registries[registryName].constructor.filename)
        .join('|'),
      trailingPattern = `/+(${registryFilenames})`,
      ignorePatterns = this.registryFolders.map(folder => `/${folder}/**/+(${registryFilenames})`);

    const files = await Promise.all(
      patterns.map(pattern =>
        glob(pattern.replace(/\/?$/, trailingPattern), {
          cwd: root,
          ignore: ignorePatterns.map(ignorePattern => pattern.replace(/\/?$/, ignorePattern)),
        })
      )
    );

    for (const file of new Set(Array.prototype.concat.apply([], files))) {
      const loc = path.join(root, path.dirname(file)),
        manifest = await this.findManifest(loc, false);

      if (!manifest) continue;

      if (!manifest.name) this.reporter.warn(this.reporter.lang('workspaceNameMandatory', loc));
      else if (!manifest.version) this.reporter.warn(this.reporter.lang('workspaceVersionMandatory', loc));
      else {
        if (Object.prototype.hasOwnProperty.call(workspaces, manifest.name))
          throw new MessageError(this.reporter.lang('workspaceNameDuplicate', manifest.name));

        workspaces[manifest.name] = {loc, manifest};
      }
    }

    return workspaces;
  }

  getWorkspaces(manifest, shouldThrow = false) {
    if (!manifest || !this.workspacesEnabled) return void 0;

    const ws = extractWorkspaces(manifest);
    if (!ws) return ws;

    let wsCopy = {...ws};
    const warnings = [],
      errors = [];

    if (wsCopy.packages && wsCopy.packages.length > 0 && !manifest.private) {
      errors.push(this.reporter.lang('workspacesRequirePrivateProjects'));
      wsCopy = void 0;
    }
    if (wsCopy && wsCopy.nohoist && wsCopy.nohoist.length > 0)
      if (!this.workspacesNohoistEnabled) {
        warnings.push(this.reporter.lang('workspacesNohoistDisabled', manifest.name));
        wsCopy.nohoist = void 0;
      } else if (!manifest.private) {
        errors.push(this.reporter.lang('workspacesNohoistRequirePrivatePackages', manifest.name));
        wsCopy.nohoist = void 0;
      }

    if (errors.length > 0 && shouldThrow) throw new MessageError(errors.join('\n'));

    const msg = errors.concat(warnings).join('\n');
    msg.length > 0 && this.reporter.warn(msg);

    return wsCopy;
  }

  getFolder(pkg) {
    let registryName = pkg._registry;
    if (!registryName) {
      const ref = pkg._reference;
      invariant(ref, 'expected reference');
      registryName = ref.registry;
    }
    return this.registries[registryName].folder;
  }

  async getRootManifests() {
    const manifests = {};
    for (const registryName of registryNames) {
      const registry = registries[registryName],
        jsonLoc = path.join(this.cwd, registry.filename);

      let indent,
        object = {},
        exists$1 = false;
      if (await exists(jsonLoc)) {
        exists$1 = true;

        const info = await this.readJson(jsonLoc, readJsonAndFile);
        object = info.object;
        indent = detectIndent(info.content).indent || void 0;
      }
      manifests[registryName] = {loc: jsonLoc, object, exists: exists$1, indent};
    }
    return manifests;
  }

  async saveRootManifests(manifests) {
    for (const registryName of registryNames) {
      const {loc, object, exists, indent} = manifests[registryName];
      if (!exists && !Object.keys(object).length) continue;

      for (const field of DEPENDENCY_TYPES) if (object[field]) object[field] = sortObject(object[field]);

      await writeFilePreservingEol(loc, JSON.stringify(object, null, indent || DEFAULT_INDENT) + '\n');
    }
  }

  readJson(loc, factory = readJson) {
    try {
      return factory(loc);
    } catch (err) {
      throw err instanceof SyntaxError ? new MessageError(this.reporter.lang('jsonError', loc, err.message)) : err;
    }
  }

  static create(opts = {}, reporter = new NoopReporter()) {
    const config = new Config(reporter);
    return config.init(opts).then(() => config);
  }
}

function extractWorkspaces(manifest) {
  return !manifest || !manifest.workspaces
    ? void 0
    : Array.isArray(manifest.workspaces)
    ? {packages: manifest.workspaces}
    : (manifest.workspaces.packages && Array.isArray(manifest.workspaces.packages)) ||
      (manifest.workspaces.nohoist && Array.isArray(manifest.workspaces.nohoist))
    ? manifest.workspaces
    : void 0;
}

const WHITESPACE_RE = /^\s+$/;

function sortFilter(files, filters, keepFiles = new Set(), possibleKeepFiles = new Set(), ignoreFiles = new Set()) {
  for (const file of files) {
    let keep = false;

    for (const filter of filters)
      if (filter.isNegation && matchesFilter(filter, file.basename, file.relative)) {
        keep = true;
        break;
      }

    if (keep) {
      keepFiles.add(file.relative);
      continue;
    }

    keep = true;
    for (const filter of filters)
      if (!filter.isNegation && matchesFilter(filter, file.basename, file.relative)) {
        keep = false;
        break;
      }

    keep ? possibleKeepFiles.add(file.relative) : ignoreFiles.add(file.relative);
  }

  for (const file of possibleKeepFiles)
    for (const parts = path.dirname(file).split(path.sep); parts.length; ) {
      const folder = parts.join(path.sep);
      if (ignoreFiles.has(folder)) {
        ignoreFiles.add(file);
        break;
      }
      parts.pop();
    }

  for (const file of possibleKeepFiles) ignoreFiles.has(file) || keepFiles.add(file);

  for (const file of keepFiles)
    for (const parts = path.dirname(file).split(path.sep); parts.length; ) {
      ignoreFiles.delete(parts.join(path.sep));
      parts.pop();
    }

  return {ignoreFiles, keepFiles};
}

function matchesFilter(filter, basename, loc) {
  let filterByBasename = true;
  if (filter.base && filter.base !== '.') {
    loc = path.relative(filter.base, loc);
    filterByBasename = false;
  }
  loc = loc.replace(/\\/g, '/');

  return (
    filter.regex.test(loc) ||
    filter.regex.test('/' + loc) ||
    (filterByBasename && filter.regex.test(basename)) ||
    micromatch.isMatch(loc, filter.pattern)
  );
}

function ignoreLinesToRegex(lines, base = '.') {
  return lines
    .map((line) => {
      if (line === '' || line === '!' || line[0] === '#' || WHITESPACE_RE.test(line)) return null;

      let pattern = line,
        isNegation = false;

      if (pattern[0] === '!') {
        isNegation = true;
        pattern = pattern.slice(1);
      }

      pattern = removeSuffix(pattern, '/');

      const regex = micromatch.makeRe(pattern.trim(), {dot: true, nocase: true});

      return regex ? {base, isNegation, pattern, regex} : null;
    })
    .filter(Boolean);
}

function filterOverridenGitignores(files) {
  const IGNORE_FILENAMES = ['.yarnignore', '.npmignore', '.gitignore'],
    GITIGNORE_NAME = IGNORE_FILENAMES[2];
  return files.filter(file => IGNORE_FILENAMES.indexOf(file.basename) > -1).reduce((acc, file) => {
    if (file.basename !== GITIGNORE_NAME) return [...acc, file];

    const dir = path.dirname(file.absolute),
      higherPriorityIgnoreFilePaths = [path.join(dir, IGNORE_FILENAMES[0]), path.join(dir, IGNORE_FILENAMES[1])];

    return files.find(file => higherPriorityIgnoreFilePaths.indexOf(path.normalize(file.absolute)) > -1)
      ? acc
      : [...acc, file];
  }, []);
}

function resolvePkg(name, dir) {
  if (name === './') return path.resolve(name, 'package.json');

  if (name[name.length - 1] !== '/') name += '/';

  if (name.charAt(0) === '/') return name + 'package.json';

  try {
    return resolve.sync(name + 'package.json', {basedir: dir || __dirname, preserveSymlinks: false});
  } catch (err) {
    if (err.code === 'MODULE_NOT_FOUND') return null;

    throw err;
  }
}

function pkg(name, dir) {
  if (name !== './') name += '/';

  var packagePath = resolvePkg(name, dir);
  if (packagePath === null) return null;

  var thePackage = require(packagePath);

  thePackage.baseDir = packagePath.slice(0, packagePath.length - 12);

  return thePackage;
}

function depsFor(name, dir) {
  var dependencies = [],
    visited = Object.create(null);

  !(function again(name, dir) {
    var thePackage = pkg(name, dir);

    if (thePackage === null) return;

    var key = thePackage.name + thePackage.version + thePackage.baseDir;

    if (visited[key]) return;
    visited[key] = true;

    dependencies.push(thePackage);

    return Object.keys(thePackage.dependencies || {}).forEach(function(dep) {
      again(dep, thePackage.baseDir);
    });
  })(name, dir);

  return dependencies;
}

const FOLDERS_IGNORE = ['.git', 'CVS', '.svn', '.hg', 'node_modules'];

const DEFAULT_IGNORE = ignoreLinesToRegex([
  ...FOLDERS_IGNORE,

  'yarn.lock',
  '.lock-wscript',
  '.wafpickle-{0..9}',
  '*.swp',
  '._*',
  'npm-debug.log',
  'yarn-error.log',
  '.npmrc',
  '.yarnrc',
  '.yarnrc.yml',
  '.npmignore',
  '.gitignore',
  '.DS_Store',
]);

const NEVER_IGNORE = ignoreLinesToRegex([
  '!/package.json',
  '!/readme*',
  '!/+(license|licence)*',
  '!/+(changes|changelog|history)*',
]);

async function packTarball(config, {mapHeader} = {}) {
  const pkg = await config.readRootManifest(),
    {bundleDependencies, main, files: onlyFiles} = pkg;

  let filters = NEVER_IGNORE.slice();
  onlyFiles || (filters = filters.concat(DEFAULT_IGNORE));
  if (main) filters = filters.concat(ignoreLinesToRegex(['!/' + main]));

  let bundleDependenciesFiles = [];
  if (bundleDependencies)
    for (const dependency of bundleDependencies) {
      const dependencyList = depsFor(dependency, config.cwd);

      for (const dep of dependencyList) {
        const filesForBundledDep = await walk(dep.baseDir, null, new Set(FOLDERS_IGNORE));
        bundleDependenciesFiles = bundleDependenciesFiles.concat(filesForBundledDep);
      }
    }

  if (onlyFiles) {
    let lines = ['*'];
    lines = lines.concat(
      onlyFiles.map((filename) => '!' + filename),
      onlyFiles.map((filename) => '!' + path.join(filename, '**'))
    );
    const regexes = ignoreLinesToRegex(lines, './');
    filters = filters.concat(regexes);
  }

  const files = await walk(config.cwd, null, new Set(FOLDERS_IGNORE)),
    dotIgnoreFiles = filterOverridenGitignores(files);

  for (const file of dotIgnoreFiles) {
    const regexes = ignoreLinesToRegex((await readFile(file.absolute)).split('\n'), path.dirname(file.relative));
    filters = filters.concat(regexes);
  }

  const keepFiles = new Set(),
    ignoredFiles = new Set(),
    possibleKeepFiles = new Set();

  sortFilter(files, filters, keepFiles, possibleKeepFiles, ignoredFiles);

  for (const file of bundleDependenciesFiles) {
    const realPath = await realpath(config.cwd);
    keepFiles.add(path.relative(realPath, file.absolute));
  }

  return packWithIgnoreAndHeaders(
    config.cwd,
    name => {
      const relative = path.relative(config.cwd, name);
      return fs.lstatSync(name).isDirectory()
        ? !Array.from(keepFiles).some(name => !path.relative(relative, name).startsWith('..'))
        : !keepFiles.has(relative);
    },
    {mapHeader}
  );
}

function packWithIgnoreAndHeaders(cwd, ignoreFunction, {mapHeader} = {}) {
  return tarFs.pack(cwd, {
    ignore: ignoreFunction,
    sort: true,
    map: header => {
      const suffix = header.name === '.' ? '' : '/' + header.name;
      header.name = 'package' + suffix;
      delete header.uid;
      delete header.gid;
      return mapHeader ? mapHeader(header) : header;
    },
  });
}

function pack(config) {
  return packTarball(config).then(packer => packer.pipe(new zlib.Gzip()));
}

function setFlags$3(commander) {
  commander.description('Creates a compressed gzip archive of package dependencies.');
  commander.option('-f, --filename <filename>', 'filename');
}

function hasWrapper$3(commander, args) {
  return true;
}

async function run$3(config, reporter, flags, args) {
  const pkg = await config.readRootManifest();
  if (!pkg.name) throw new MessageError(reporter.lang('noName'));
  if (!pkg.version) throw new MessageError(reporter.lang('noVersion'));

  const normaliseScope = name => (name[0] === '@' ? name.substr(1).replace('/', '-') : name),
    filename = flags.filename || path.join(config.cwd, `${normaliseScope(pkg.name)}-v${pkg.version}.tgz`);

  await config.executeLifecycleScript('prepack');

  const stream = await pack(config);

  await new Promise((resolve, reject) => {
    stream.pipe(fs.createWriteStream(filename));
    stream.on('error', reject);
    stream.on('close', resolve);
  });

  await config.executeLifecycleScript('postpack');

  reporter.success(reporter.lang('packWroteTarball', filename));
}

var pack$1 = {
  __proto__: null,
  packTarball,
  packWithIgnoreAndHeaders,
  pack,
  setFlags: setFlags$3,
  hasWrapper: hasWrapper$3,
  run: run$3,
};

const PACKED_FLAG = '1';

class GitFetcher extends BaseFetcher {
  async setupMirrorFromCache() {
    const tarballMirrorPath = this.getTarballMirrorPath(),
      tarballCachePath = this.getTarballCachePath();

    if (tarballMirrorPath != null && !(await exists(tarballMirrorPath)) && (await exists(tarballCachePath))) {
      await mkdirp(path.dirname(tarballMirrorPath));
      await copy(tarballCachePath, tarballMirrorPath, this.reporter);
    }
  }

  getTarballMirrorPath({withCommit = true} = {}) {
    const {pathname} = url.parse(this.reference);

    if (pathname == null) return null;

    const hash = this.hash;

    let packageFilename = withCommit && hash ? `${path.basename(pathname)}-${hash}` : '' + path.basename(pathname);

    if (packageFilename.startsWith(':')) packageFilename = packageFilename.substr(1);

    return this.config.getOfflineMirrorPath(packageFilename);
  }

  getTarballCachePath() {
    return path.join(this.dest, TARBALL_FILENAME);
  }

  getLocalPaths(override) {
    return [
      override ? path.resolve(this.config.cwd, override) : null,
      this.getTarballMirrorPath(),
      this.getTarballMirrorPath({withCommit: false}),
      this.getTarballCachePath(),
    ].filter(path => path != null);
  }

  fetchFromLocal(override) {
    const tarPaths = this.getLocalPaths(override);

    return readFirstAvailableStream(tarPaths).then(stream =>
      new Promise((resolve, reject) => {
        if (!stream) {
          reject(new MessageError(this.reporter.lang('tarballNotInNetworkOrCache', this.reference, tarPaths)));
          return;
        }
        invariant(stream, 'cachedStream should be available at this point');
        const tarballPath = stream.path,

          untarStream = this._createUntarStream(this.dest),

          hashStream = new HashStream();
        stream
          .pipe(hashStream)
          .pipe(untarStream)
          .on('finish', () => {
            const expectHash = this.hash;
            invariant(expectHash, 'Commit hash required');

            /*actualHash =*/ hashStream.getHash();

            resolve({hash: expectHash});
          })
          .on('error', function(err) {
            reject(new MessageError(this.reporter.lang('fetchErrorCorrupt', err.message, tarballPath)));
          });
      })
    );
  }

  async hasPrepareScript(git) {
    const manifestFile = await git.getFile('package.json');

    if (manifestFile) {
      const scripts = JSON.parse(manifestFile).scripts;
      return Boolean(scripts && scripts.prepare);
    }

    return false;
  }

  async fetchFromExternal() {
    const hash = this.hash;
    invariant(hash, 'Commit hash required');

    const gitUrl = Git.npmUrlToGitUrl(this.reference),
      git = new Git(this.config, gitUrl, hash);
    await git.init();

    (await this.hasPrepareScript(git))
      ? await this.fetchFromInstallAndPack(git)
      : await this.fetchFromGitArchive(git);

    return {hash};
  }

  async fetchFromInstallAndPack(git) {
    const prepareDirectory = this.config.getTemp(`${hash(git.gitUrl.repository)}.${git.hash}.prepare`);
    await unlink(prepareDirectory);

    await git.clone(prepareDirectory);

    const [prepareConfig, prepareLockFile] = await Promise.all([
      Config.create(
        {binLinks: true, cwd: prepareDirectory, disablePrepublish: true, production: false},
        this.reporter
      ),
      Lockfile.fromDirectory(prepareDirectory, this.reporter),
    ]);
    await install(prepareConfig, this.reporter, {}, prepareLockFile);

    const tarballMirrorPath = this.getTarballMirrorPath(),
      tarballCachePath = this.getTarballCachePath();

    if (tarballMirrorPath) await this._packToTarball(prepareConfig, tarballMirrorPath);
    if (tarballCachePath) await this._packToTarball(prepareConfig, tarballCachePath);

    await this._packToDirectory(prepareConfig, this.dest);

    await unlink(prepareDirectory);
  }

  async _packToTarball(config, path) {
    const tarballStream = await this._createTarballStream(config);
    await new Promise((resolve, reject) => {
      const writeStream = fs.createWriteStream(path);
      tarballStream.on('error', reject);
      writeStream.on('error', reject);
      writeStream.on('end', resolve);
      writeStream.on('open', () => {
        tarballStream.pipe(writeStream);
      });
      writeStream.once('finish', resolve);
    });
  }

  async _packToDirectory(config, dest) {
    const tarballStream = await this._createTarballStream(config);
    await new Promise((resolve, reject) => {
      const untarStream = this._createUntarStream(dest);
      tarballStream.on('error', reject);
      untarStream.on('error', reject);
      untarStream.on('end', resolve);
      untarStream.once('finish', resolve);
      tarballStream.pipe(untarStream);
    });
  }

  _createTarballStream(config) {
    let savedPackedHeader = false;
    return packTarball(config, {
      mapHeader(header) {
        if (!savedPackedHeader) {
          savedPackedHeader = true;
          header.pax = header.pax || {};
          header.pax.packed = PACKED_FLAG;
        }
        return header;
      },
    });
  }

  _createUntarStream(dest) {
    const PREFIX = 'package/';
    let isPackedTarball = void 0;
    return tarFs.extract(dest, {
      dmode: 0o555,
      fmode: 0o444,
      chown: false,
      map: header => {
        if (isPackedTarball === void 0) isPackedTarball = header.pax && header.pax.packed === PACKED_FLAG;

        if (isPackedTarball) header.name = header.name.substr(PREFIX.length);
      },
    });
  }

  async fetchFromGitArchive(git) {
    await git.clone(this.dest);
    const tarballMirrorPath = this.getTarballMirrorPath(),
      tarballCachePath = this.getTarballCachePath();

    if (tarballMirrorPath) await git.archive(tarballMirrorPath);

    if (tarballCachePath) await git.archive(tarballCachePath);
  }

  _fetch() {
    return this.fetchFromLocal().catch(_err => this.fetchFromExternal());
  }
}

class WorkspaceFetcher {
  constructor(dest, remote, config) {
    this.config = config;
    this.dest = dest;
    this.registry = remote.registry;
    this.workspaceDir = remote.reference;
    this.registryRemote = remote.registryRemote;
  }

  setupMirrorFromCache() {
    return Promise.resolve();
  }

  async fetch() {
    const pkg = await this.config.readManifest(this.workspaceDir, this.registry);

    if (this.registryRemote) await this.fetchRemoteWorkspace(this.registryRemote, pkg);

    return {resolved: null, hash: '', cached: false, dest: this.dest, package: {...pkg, _uid: pkg.version}};
  }

  fetchRemoteWorkspace(remote, manifest) {
    return fetchOneRemote(remote, manifest.name, manifest.version, this.dest, this.config);
  }
}

var fetchers = {
  __proto__: null,
  base: BaseFetcher,
  copy: CopyFetcher,
  git: GitFetcher,
  tarball: TarballFetcher,
  workspace: WorkspaceFetcher,
};

async function fetchCache(dest, fetcher, config, remote) {
  const {hash, package: pkg, remote: cacheRemote} = await config.readPackageMetadata(dest),

    cacheIntegrity = cacheRemote.cacheIntegrity || cacheRemote.integrity,
    cacheHash = cacheRemote.hash;

  if (remote.integrity && (!cacheIntegrity || !ssri.parse(cacheIntegrity).match(remote.integrity)))
    throw new SecurityError(config.reporter.lang('fetchBadIntegrityCache', pkg.name, cacheIntegrity, remote.integrity));

  if (remote.hash && (!cacheHash || cacheHash !== remote.hash))
    throw new SecurityError(config.reporter.lang('fetchBadHashCache', pkg.name, cacheHash, remote.hash));

  await fetcher.setupMirrorFromCache();
  return {package: pkg, hash, dest, cached: true};
}

async function fetchOneRemote(remote, name, version, dest, config) {
  if (remote.type === 'link') {
    const mockPkg = {_uid: '', name: '', version: '0.0.0'};
    return Promise.resolve({resolved: null, hash: '', dest, package: mockPkg, cached: false}); //
  }

  const Fetcher = fetchers[remote.type];
  if (!Fetcher) throw new MessageError(config.reporter.lang('unknownFetcherFor', remote.type));

  const fetcher = new Fetcher(dest, remote, config);
  if (await config.isValidModuleDest(dest)) return fetchCache(dest, fetcher, config, remote);

  await unlink(dest);

  try {
    return await fetcher.fetch({name, version});
  } catch (err) {
    try {
      await unlink(dest);
    } catch (_err2) {}
    throw err;
  }
}

function fetchOne(ref, config) {
  const dest = config.generateModuleCachePath(ref);

  return fetchOneRemote(ref.remote, ref.name, ref.version, dest, config);
}

async function maybeFetchOne(ref, config) {
  try {
    return await fetchOne(ref, config);
  } catch (err) {
    if (ref.optional) {
      config.reporter.error(err.message);
      return null;
    }
    throw err;
  }
}

function fetch(pkgs, config) {
  const pkgsPerDest = new Map();
  pkgs = pkgs.filter(pkg => {
    const ref = pkg._reference;
    if (!ref) return false;

    const dest = config.generateModuleCachePath(ref),
      otherPkg = pkgsPerDest.get(dest);
    if (otherPkg) {
      config.reporter.warn(
        config.reporter.lang('multiplePackagesCantUnpackInSameDestination', ref.patterns, dest, otherPkg.patterns)
      );
      return false;
    }
    pkgsPerDest.set(dest, ref);
    return true;
  });
  const tick = config.reporter.progress(pkgs.length);

  return queue(
    pkgs,
    async pkg => {
      const ref = pkg._reference;
      if (!ref) return pkg;

      const res = await maybeFetchOne(ref, config);
      let newPkg;

      if (res) {
        newPkg = res.package;

        if (ref.remote.hash) {
          if (ref.remote.hash !== res.hash && config.updateChecksums) {
            const oldHash = ref.remote.hash;
            if (ref.remote.resolved) ref.remote.resolved = ref.remote.resolved.replace(oldHash, res.hash);

            ref.config.cache = Object.keys(ref.config.cache).reduce((cache, entry) => {
              cache[entry.replace(oldHash, res.hash)] = ref.config.cache[entry];
              return cache;
            }, {});
          }
          ref.remote.hash = res.hash || ref.remote.hash;
        }
      }

      tick && tick();

      if (!newPkg) return pkg;

      newPkg._reference = ref;
      newPkg._remote = ref.remote;
      newPkg.name = pkg.name;
      newPkg.fresh = pkg.fresh;
      return newPkg;
    },
    config.networkConcurrency
  );
}

const INSTALL_STAGES = ['preinstall', 'install', 'postinstall'];

class PackageInstallScripts {
  constructor(config, resolver, force) {
    this.installed = 0;
    this.resolver = resolver;
    this.reporter = config.reporter;
    this.config = config;
    this.force = force;
    this.artifacts = {};
  }

  setForce(force) {
    this.force = force;
  }

  setArtifacts(artifacts) {
    this.artifacts = artifacts;
  }

  getArtifacts() {
    return this.artifacts;
  }

  getInstallCommands(pkg) {
    const scripts = pkg.scripts;
    if (scripts) {
      const cmds = [];
      for (const stage of INSTALL_STAGES) {
        const cmd = scripts[stage];
        cmd && cmds.push([stage, cmd]);
      }
      return cmds;
    }
    return [];
  }

  async walk(loc) {
    const files = await walk(loc, null, new Set(this.config.registryFolders)),
      mtimes = new Map();
    for (const file of files) mtimes.set(file.relative, file.mtime);

    return mtimes;
  }

  async saveBuildArtifacts(loc, pkg, beforeFiles, spinner) {
    const afterFiles = await this.walk(loc),

      buildArtifacts = [];
    for (const [file, mtime] of afterFiles)
      (beforeFiles.has(file) && beforeFiles.get(file) === mtime) || buildArtifacts.push(file);

    if (!buildArtifacts.length) return;

    const ref = pkg._reference;
    invariant(ref, 'expected reference');
    this.artifacts[`${pkg.name}@${pkg.version}`] = buildArtifacts;
  }

  async install(cmds, pkg, spinner) {
    const ref = pkg._reference;
    invariant(ref, 'expected reference');
    const locs = ref.locations;

    let updateProgress;

    if (cmds.length > 0)
      updateProgress = data => {
        const dataStr = data.toString().trim();

        invariant(spinner && spinner.tick, 'We should have spinner and its ticker here');
        dataStr && spinner.tick(dataStr.substr(dataStr.lastIndexOf('\n') + 1).replace(/\t/g, ' '));
      };

    try {
      for (const [stage, cmd] of cmds)
        await Promise.all(
          locs.map(loc =>
            executeLifecycleScript({
              stage,
              config: this.config,
              cwd: loc,
              cmd,
              isInteractive: false,
              updateProgress,
            }).then(({stdout}) => {
              this.reporter.verbose(stdout);
            })
          )
        );
    } catch (err) {
      err.message = `${locs.join(', ')}: ${err.message}`;

      invariant(ref, 'expected reference');

      if (!ref.optional) throw err;

      ref.ignore = true;
      ref.incompatible = true;
      this.reporter.warn(this.reporter.lang('optionalModuleScriptFail', err.message));
      this.reporter.info(this.reporter.lang('optionalModuleFail'));

      try {
        await Promise.all(locs.map(loc => unlink(loc).then(noop)));
      } catch (e) {
        this.reporter.error(this.reporter.lang('optionalModuleCleanupFail', e.message));
      }
    }
  }

  packageCanBeInstalled(pkg) {
    if (!this.getInstallCommands(pkg).length) return false;

    if (this.config.packBuiltPackages && pkg.prebuiltVariants)
      for (const variant in pkg.prebuiltVariants)
        if (pkg._remote && pkg._remote.reference && pkg._remote.reference.includes(variant)) return false;

    const ref = pkg._reference;
    invariant(ref, 'Missing package reference');

    return !((!ref.fresh && !this.force) || !ref.locations.length || ref.ignore);
  }

  async runCommand(spinner, pkg) {
    const cmds = this.getInstallCommands(pkg);
    spinner.setPrefix(++this.installed, pkg.name);
    await this.install(cmds, pkg, spinner);
  }

  detectCircularDependencies(root, seenManifests, pkg) {
    const ref = pkg._reference;
    invariant(ref, 'expected reference');

    const deps = ref.dependencies;
    for (const dep of deps) {
      const pkgDep = this.resolver.getStrictResolvedPattern(dep);
      if (seenManifests.has(pkgDep)) continue;

      seenManifests.add(pkgDep);
      if (pkgDep == root || this.detectCircularDependencies(root, seenManifests, pkgDep)) return true;
    }
    return false;
  }

  findInstallablePackage(workQueue, installed) {
    for (const pkg of workQueue) {
      const ref = pkg._reference;
      invariant(ref, 'expected reference');
      const deps = ref.dependencies;

      let dependenciesFulfilled = true;
      for (const dep of deps) {
        const pkgDep = this.resolver.getStrictResolvedPattern(dep);
        if (!installed.has(pkgDep)) {
          dependenciesFulfilled = false;
          break;
        }
      }

      if (dependenciesFulfilled || this.detectCircularDependencies(pkg, new Set(), pkg)) return pkg;
    }
    return null;
  }

  async worker(spinner, workQueue, installed, waitQueue) {
    while (workQueue.size > 0) {
      const pkg = this.findInstallablePackage(workQueue, installed);

      if (pkg == null) {
        spinner.clear();
        await new Promise(resolve => waitQueue.add(resolve));
        continue;
      }

      workQueue.delete(pkg);
      if (this.packageCanBeInstalled(pkg)) await this.runCommand(spinner, pkg);

      installed.add(pkg);
      for (const workerResolve of waitQueue) workerResolve();
      waitQueue.clear();
    }
  }

  async init(seedPatterns) {
    const workQueue = new Set(),
      installed = new Set(),
      pkgs = this.resolver.getTopologicalManifests(seedPatterns);
    let installablePkgs = 0;
    const beforeFilesMap = new Map();
    for (const pkg of pkgs) {
      if (this.packageCanBeInstalled(pkg)) {
        const ref = pkg._reference;
        invariant(ref, 'expected reference');
        await Promise.all(
          ref.locations.map(loc =>
            this.walk(loc).then(m => {
              beforeFilesMap.set(loc, m);
              installablePkgs += 1;
            })
          )
        );
      }
      workQueue.add(pkg);
    }

    const set = this.reporter.activitySet(installablePkgs, Math.min(installablePkgs, this.config.childConcurrency)),

      waitQueue = new Set();
    await Promise.all(set.spinners.map(spinner => this.worker(spinner, workQueue, installed, waitQueue)));
    const offlineMirrorPath = this.config.getOfflineMirrorPath();
    if (this.config.packBuiltPackages && offlineMirrorPath) {
      for (const pkg of pkgs)
        if (this.packageCanBeInstalled(pkg)) {
          let prebuiltPath = path.join(offlineMirrorPath, 'prebuilt');
          await mkdirp(prebuiltPath);
          const prebuiltFilename = getPlatformSpecificPackageFilename(pkg);
          prebuiltPath = path.join(prebuiltPath, prebuiltFilename + '.tgz');
          const ref = pkg._reference;
          invariant(ref, 'expected reference');
          const builtPackagePaths = ref.locations;

          await Promise.all(
            builtPackagePaths.map(async builtPackagePath => {
              const stream = await packWithIgnoreAndHeaders(builtPackagePath);

              const hash = await new Promise((resolve, reject) => {
                const validateStream = new HashStream();
                stream
                  .pipe(validateStream)
                  .pipe(fs.createWriteStream(prebuiltPath))
                  .on('error', reject)
                  .on('close', () => resolve(validateStream.getHash()));
              });
              pkg.prebuiltVariants = pkg.prebuiltVariants || {};
              pkg.prebuiltVariants[prebuiltFilename] = hash;
            })
          );
        }
    } else
      for (const pkg of pkgs)
        if (this.packageCanBeInstalled(pkg)) {
          const ref = pkg._reference;
          invariant(ref, 'expected reference');
          const beforeFiles = ref.locations.map(loc => beforeFilesMap.get(loc));
          await Promise.all(
            beforeFiles.map((b, index) => {
              invariant(b, 'files before installation should always be recorded');
              return this.saveBuildArtifacts(ref.locations[index], pkg, b, set.spinners[0]).then(noop);
            })
          );
        }

    set.end();
  }
}

function satisfiesWithPrereleases(version, range, loose = false) {
  let semverRange, semverVersion;
  try {
    semverRange = new semver.Range(range, loose);
  } catch (_err) {
    return false;
  }

  if (!version) return false;
  try {
    semverVersion = new semver.SemVer(version, semverRange.loose);
  } catch (_err) {
    return false;
  }

  return semverRange.set.some(
    comparatorSet =>
      !(comparatorSet = comparatorSet.map(comparator => {
        if (comparator.operator !== '<' || !comparator.value || comparator.semver.prerelease.length)
          return comparator;

        comparator.semver.inc('pre', 0);

        const comparatorString = comparator.operator + comparator.semver.version;
        return new semver.Comparator(comparatorString, comparator.loose);
      })).some(comparator => !comparator.test(semverVersion)) //
  );
}

const PRE_RELEASES = {major: 'premajor', minor: 'preminor', patch: 'prepatch'};

function diffWithUnstable(version1, version2) {
  if (semver.eq(version1, version2) === false) {
    const v1 = semver.parse(version1),
      v2 = semver.parse(version2);

    if (v1 != null && v2 != null) {
      const isPreRelease = v1.prerelease.length > 0 || v2.prerelease.length > 0,
        preMajor = v1.major === 0 || v2.major === 0,
        preMinor = preMajor && (v1.minor === 0 || v2.minor === 0);

      let diff = null;

      if (v1.major !== v2.major) diff = 'major';
      else if (v1.minor !== v2.minor) diff = preMajor ? 'major' : 'minor';
      else if (v1.patch !== v2.patch) diff = preMinor ? 'major' : preMajor ? 'minor' : 'patch';

      if (isPreRelease) diff = diff != null ? PRE_RELEASES[diff] : 'prerelease';

      return diff;
    }
  }

  return null;
}

const VERSIONS = Object.assign({}, process.versions, {yarn: version});

function isValid(items, actual) {
  let isNotWhitelist = true,
    isBlacklist = false;

  for (const item of items)
    if (item[0] === '!') {
      isBlacklist = true;

      if (actual === item.slice(1)) return false;
    } else {
      isNotWhitelist = false;

      if (item === actual) return true;
    }

  return isBlacklist && isNotWhitelist;
}

const aliases = nullify({iojs: 'node'}),

  ignore = ['npm', 'teleport', 'rhino', 'cordovaDependencies', 'parcel'];

function testEngine(name, range, versions, looseSemver) {
  const actual = versions[name];
  if (!actual || !semver.valid(actual, looseSemver)) return false;

  if (semver.satisfies(actual, range, looseSemver)) return true;

  if (name === 'yarn' && satisfiesWithPrereleases(actual, range, looseSemver)) return true;

  if (name === 'node' && semver.gt(actual, '1.0.0', looseSemver)) {
    const major = semver.major(actual, looseSemver),
      fakes = ['0.10.', '0.11.', '0.12.', '0.13.'];
    for (const actualFake of fakes) if (semver.satisfies(actualFake + major, range, looseSemver)) return true;
  }

  return false;
}

function isValidArch(archs) {
  return isValid(archs, process.arch);
}

function isValidPlatform(platforms) {
  return isValid(platforms, process.platform);
}

function checkOne(info, config, ignoreEngines) {
  let didError = false;
  const reporter = config.reporter,
    human = `${info.name}@${info.version}`;

  const pushError = msg => {
    const ref = info._reference;

    if (ref && ref.optional) {
      ref.ignore = true;
      ref.incompatible = true;
    } else {
      reporter.error(`${human}: ${msg}`);
      didError = true;
    }
  };

  const {os, cpu, engines} = info;

  !shouldCheckPlatform(os, config.ignorePlatform) || isValidPlatform(os) ||
    pushError(reporter.lang('incompatibleOS', process.platform));

  !shouldCheckCpu(cpu, config.ignorePlatform) || isValidArch(cpu) ||
    pushError(reporter.lang('incompatibleCPU', process.arch));

  if (shouldCheckEngines(engines, ignoreEngines))
    for (const entry of entries(info.engines)) {
      let name = entry[0];
      const range = entry[1];

      if (aliases[name]) name = aliases[name];

      VERSIONS[name]
        ? testEngine(name, range, VERSIONS, config.looseSemver) ||
          pushError(reporter.lang('incompatibleEngine', name, range, VERSIONS[name]))
        : ignore.indexOf(name) < 0 && reporter.warn(`${human}: ${reporter.lang('invalidEngine', name)}`);
    }

  if (didError) throw new MessageError(reporter.lang('foundIncompatible'));
}

function check(infos, config, ignoreEngines) {
  for (const info of infos) checkOne(info, config, ignoreEngines);
}

function shouldCheckCpu(cpu, ignorePlatform) {
  return !ignorePlatform && Array.isArray(cpu) && cpu.length > 0;
}

function shouldCheckPlatform(os, ignorePlatform) {
  return !ignorePlatform && Array.isArray(os) && os.length > 0;
}

function shouldCheckEngines(engines, ignoreEngines) {
  return !ignoreEngines && typeof engines == 'object';
}

function shouldCheck(manifest, options) {
  return (
    shouldCheckCpu(manifest.cpu, options.ignorePlatform) ||
    shouldCheckPlatform(manifest.os, options.ignorePlatform) ||
    shouldCheckEngines(manifest.engines, options.ignoreEngines)
  );
}

class PackageReference {
  constructor(request, info, remote) {
    this.resolver = request.resolver;
    this.lockfile = request.lockfile;
    this.requests = [];
    this.config = request.config;
    this.hint = request.hint;

    this.isPlugnplay = false;

    this.registry = remote.registry;
    this.version = info.version;
    this.name = info.name;
    this.uid = info._uid;

    this.remote = remote;

    this.dependencies = [];

    this.permissions = {};
    this.patterns = [];
    this.optional = null;
    this.level = Infinity;
    this.ignore = false;
    this.incompatible = false;
    this.fresh = false;
    this.locations = [];
    this.addRequest(request);
  }

  setFresh(fresh) {
    this.fresh = fresh;
  }

  addLocation(loc) {
    this.locations.indexOf(loc) < 0 && this.locations.push(loc);
  }

  addRequest(request) {
    this.requests.push(request);

    this.level = Math.min(this.level, request.parentNames.length);
  }

  prune() {
    for (const selfPattern of this.patterns) this.resolver.removePattern(selfPattern);
  }

  addDependencies(deps) {
    this.dependencies = this.dependencies.concat(deps);
  }

  setPermission(key, val) {
    this.permissions[key] = val;
  }

  hasPermission(key) {
    return key in this.permissions && this.permissions[key];
  }

  addPattern(pattern, manifest) {
    this.resolver.addPattern(pattern, manifest);

    this.patterns.push(pattern);

    const shrunk = this.lockfile.getLocked(pattern);
    if (shrunk && shrunk.permissions)
      for (const [key, perm] of entries(shrunk.permissions)) this.setPermission(key, perm);
  }

  addOptional(optional) {
    this.optional == null ? (this.optional = optional) : optional || (this.optional = false);
  }
}

class WorkspaceResolver extends BaseResolver {
  static isWorkspace(pattern, workspaceLayout) {
    return !!workspaceLayout && !!workspaceLayout.getManifestByPattern(pattern);
  }

  constructor(request, fragment, workspaceLayout) {
    super(request, fragment);
    this.workspaceLayout = workspaceLayout;
  }

  resolve(downloadedManifest) {
    const workspace = this.workspaceLayout.getManifestByPattern(this.request.pattern);
    invariant(workspace, 'expected workspace');
    const {manifest, loc} = workspace;
    if (manifest._remote && manifest._remote.registryRemote) return Promise.resolve(manifest);

    const registry = manifest._registry;
    invariant(registry, 'expected reference');
    let registryRemote,
      hash = '';
    if (downloadedManifest && manifest.version === downloadedManifest.version) {
      registryRemote = downloadedManifest._remote;
      invariant(registryRemote, 'missing remote info');
      hash = registryRemote.hash;
      Object.keys(manifest).forEach(k => k.startsWith('_') || delete manifest[k]);
      Object.assign(manifest, downloadedManifest);
    } else if (manifest._remote && manifest._remote.hash) {
      invariant(workspace.manifest._remote, 'missing remote info');
      registryRemote = workspace.manifest._remote.registryRemote;
      hash = manifest._remote.hash;
    }
    if (registryRemote) registryRemote = {...registryRemote};

    manifest._remote = Object.assign(manifest._remote || {}, {
      type: 'workspace',
      registryRemote,
      registry,
      hash,
      reference: loc,
    });

    manifest._uid = manifest.version;

    return Promise.resolve(manifest);
  }
}

class PackageRequest {
  constructor(req, resolver) {
    this.parentRequest = req.parentRequest;
    this.parentNames = req.parentNames || [];
    this.lockfile = resolver.lockfile;
    this.registry = req.registry;
    this.reporter = resolver.reporter;
    this.resolver = resolver;
    this.optional = req.optional;
    this.hint = req.hint;
    this.pattern = req.pattern;
    this.config = resolver.config;
    this.foundInfo = null;
  }

  init() {
    this.resolver.usedRegistries.add(this.registry);
  }

  getLocked(remoteType) {
    const shrunk = this.lockfile.getLocked(this.pattern);

    if (shrunk && shrunk.resolved) {
      const resolvedParts = explodeHashedUrl(shrunk.resolved),

        preferredRemoteType = /^git(\+[a-z0-9]+)?:\/\//.test(resolvedParts.url) ? 'git' : remoteType;

      return {
        name: shrunk.name,
        version: shrunk.version,
        _uid: shrunk.uid,
        _remote: {
          resolved: shrunk.resolved,
          type: preferredRemoteType,
          reference: resolvedParts.url,
          hash: resolvedParts.hash,
          integrity: shrunk.integrity,
          registry: shrunk.registry,
          packageName: shrunk.name,
        },
        optionalDependencies: shrunk.optionalDependencies || {},
        dependencies: shrunk.dependencies || {},
        prebuiltVariants: shrunk.prebuiltVariants || {},
      };
    }

    return null;
  }

  async findVersionOnRegistry(pattern) {
    const {range, name} = await this.normalize(pattern),

      exoticResolver = getExoticResolver(range);
    if (exoticResolver) {
      let data = await this.findExoticVersionInfo(exoticResolver, range);

      data = Object.assign({}, data);

      data.name = name;
      return data;
    }

    const resolver = new (this.getRegistryResolver())(this, name, range);
    try {
      return await resolver.resolve();
    } catch (err) {
      if (!(err instanceof MessageError) && this.parentRequest && this.parentRequest.pattern)
        throw new MessageError(
          this.reporter.lang('requiredPackageNotFoundRegistry', pattern, this.parentRequest.pattern, this.registry)
        );

      throw err;
    }
  }

  getRegistryResolver() {
    const Resolver = registries$1[this.registry];
    if (Resolver) return Resolver;

    throw new MessageError(this.reporter.lang('unknownRegistryResolver', this.registry));
  }

  async normalizeRange(pattern) {
    if (pattern.indexOf(':') > -1 || pattern.indexOf('@') > -1 || getExoticResolver(pattern)) return pattern;

    if (!semver.validRange(pattern))
      try {
        if (await exists(path.join(this.config.cwd, pattern, NODE_PACKAGE_JSON))) {
          this.reporter.warn(this.reporter.lang('implicitFileDeprecated', pattern));
          return 'file:' + pattern;
        }
      } catch (_err) {}

    return pattern;
  }

  normalize(pattern) {
    const {name, range, hasVersion} = normalizePattern(pattern);
    return this.normalizeRange(range).then(newRange => ({name, range: newRange, hasVersion}));
  }

  findExoticVersionInfo(ExoticResolver, range) {
    return new ExoticResolver(this, range).resolve();
  }

  async findVersionInfo() {
    const exoticResolver = getExoticResolver(this.pattern);
    if (exoticResolver) return this.findExoticVersionInfo(exoticResolver, this.pattern);

    if (WorkspaceResolver.isWorkspace(this.pattern, this.resolver.workspaceLayout)) {
      invariant(this.resolver.workspaceLayout, 'expected workspaceLayout');
      const resolver = new WorkspaceResolver(this, this.pattern, this.resolver.workspaceLayout);
      let manifest;
      if (
        this.config.focus &&
        !this.pattern.includes(this.resolver.workspaceLayout.virtualManifestName) &&
        !this.pattern.startsWith(this.config.focusedWorkspaceName + '@')
      ) {
        const localInfo = this.resolver.workspaceLayout.getManifestByPattern(this.pattern);
        invariant(localInfo, 'expected local info for ' + this.pattern);
        const localManifest = localInfo.manifest,
          requestPattern = localManifest.name + '@' + localManifest.version;
        manifest = await this.findVersionOnRegistry(requestPattern);
      }
      return resolver.resolve(manifest);
    }

    return this.findVersionOnRegistry(this.pattern);
  }

  reportResolvedRangeMatch(info, resolved) {}

  resolveToExistingVersion(info) {
    const {range, name} = normalizePattern(this.pattern),
      solvedRange = semver.validRange(range) ? info.version : range,
      resolved = this.resolver.getHighestRangeVersionMatch(name, solvedRange, info);
    invariant(resolved, 'should have a resolved reference');

    this.reportResolvedRangeMatch(info, resolved);
    const ref = resolved._reference;
    invariant(ref, 'Resolved package info has no package reference');
    ref.addRequest(this);
    ref.addPattern(this.pattern, resolved);
    ref.addOptional(this.optional);
  }

  async find({fresh, frozen}) {
    const info = await this.findVersionInfo();

    if (!semver.valid(info.version))
      throw new MessageError(this.reporter.lang('invalidPackageVersion', info.name, info.version));

    info.fresh = fresh;
    cleanDependencies(info, false, this.reporter, () => {});

    const {range, name} = normalizePattern(this.pattern),
      solvedRange = semver.validRange(range) ? info.version : range;
    if (
      !info.fresh || frozen
        ? this.resolver.getExactVersionMatch(name, solvedRange, info)
        : this.resolver.getHighestRangeVersionMatch(name, solvedRange, info)
    ) {
      this.resolver.reportPackageWithExistingVersion(this, info);
      return;
    }

    if (info.flat && !this.resolver.flat)
      throw new MessageError(this.reporter.lang('flatGlobalError', `${info.name}@${info.version}`));

    PackageRequest.validateVersionInfo(info, this.reporter);

    const remote = info._remote;
    invariant(remote, 'Missing remote');

    const ref = new PackageReference(this, info, remote);
    ref.addPattern(this.pattern, info);
    ref.addOptional(this.optional);
    ref.setFresh(fresh);
    info._reference = ref;
    info._remote = remote;
    const promises = [],
      deps = [],
      parentNames = [...this.parentNames, name];
    for (const depName in info.dependencies) {
      const depPattern = depName + '@' + info.dependencies[depName];
      deps.push(depPattern);
      promises.push(
        this.resolver.find({
          pattern: depPattern,
          registry: remote.registry,
          optional: this.optional,
          parentRequest: this,
          parentNames,
        })
      );
    }

    for (const depName in info.optionalDependencies) {
      const depPattern = depName + '@' + info.optionalDependencies[depName];
      deps.push(depPattern);
      promises.push(
        this.resolver.find({
          hint: 'optional',
          pattern: depPattern,
          registry: remote.registry,
          optional: true,
          parentRequest: this,
          parentNames,
        })
      );
    }
    if (remote.type === 'workspace' && !this.config.production)
      for (const depName in info.devDependencies) {
        const depPattern = depName + '@' + info.devDependencies[depName];
        deps.push(depPattern);
        promises.push(
          this.resolver.find({
            hint: 'dev',
            pattern: depPattern,
            registry: remote.registry,
            optional: false,
            parentRequest: this,
            parentNames,
          })
        );
      }

    for (const promise of promises) await promise;

    ref.addDependencies(deps);

    for (const otherRequest of ref.requests.slice(1)) ref.addOptional(otherRequest.optional);
  }

  static validateVersionInfo(info, reporter) {
    const human = `${info.name}@${info.version}`;

    info.version = PackageRequest.getPackageVersion(info);

    for (const key of REQUIRED_PACKAGE_KEYS)
      if (!info[key]) throw new MessageError(reporter.lang('missingRequiredPackageKey', human, key));
  }

  static getPackageVersion(info) {
    return info.version === void 0 ? info._uid : info.version;
  }

  static async getOutdatedPackages(lockfile, install, config, reporter, filterByPatterns, flags) {
    const {requests: reqPatterns, workspaceLayout} = await install.fetchRequestFromCwd();

    let depReqPatterns = workspaceLayout
      ? reqPatterns.filter(p => !workspaceLayout.getManifestByPattern(p.pattern))
      : reqPatterns;

    if ((filterByPatterns && filterByPatterns.length) || (flags && flags.pattern)) {
      const filterByNames =
        filterByPatterns && filterByPatterns.length
          ? filterByPatterns.map(pattern => normalizePattern(pattern).name)
          : [];
      depReqPatterns = depReqPatterns.filter(
        dep =>
          filterByNames.indexOf(normalizePattern(dep.pattern).name) >= 0 ||
          (flags && flags.pattern && micromatch.contains(normalizePattern(dep.pattern).name, flags.pattern))
      );
    }

    const deps = await Promise.all(
      depReqPatterns.map(async ({pattern, hint, workspaceName, workspaceLoc}) => {
        const locked = lockfile.getLocked(pattern);
        if (!locked) throw new MessageError(reporter.lang('lockfileOutdated'));

        const {name, version: current} = locked;
        let latest = '',
          wanted = '',
          url = '';

        const normalized = normalizePattern(pattern);

        if (getExoticResolver(pattern) || getExoticResolver(normalized.range)) {
          latest = wanted = 'exotic';
          url = normalized.range;
        } else {
          const registry = config.registries[locked.registry];

          ({latest, wanted, url} = await registry.checkOutdated(config, name, normalized.range));
        }

        return {
          name,
          current,
          wanted,
          latest,
          url,
          hint,
          range: normalized.range,
          upgradeTo: '',
          workspaceName: workspaceName || '',
          workspaceLoc: workspaceLoc || '',
        };
      })
    );

    const isDepOld = ({current, latest, wanted}) =>
        latest === 'exotic' || semver.lt(current, wanted) || semver.lt(current, latest),
      orderByName = (depA, depB) => depA.name.localeCompare(depB.name);
    return deps.filter(isDepOld).sort(orderByName);
  }
}

function parsePackagePath(input) {
  return input.match(/(@[^\/]+\/)?([^/]+)/g) || [];
}

const WRONG_PATTERNS = /\/$|\/{2,}|\*+$/;

function isValidPackagePath(input) {
  return !WRONG_PATTERNS.test(input);
}

const DIRECTORY_SEPARATOR = '/',
  GLOBAL_NESTED_DEP_PATTERN = '**/';

class ResolutionMap {
  constructor(config) {
    this.resolutionsByPackage = nullify();
    this.config = config;
    this.reporter = config.reporter;
    this.delayQueue = new Set();
  }

  init(resolutions = {}) {
    for (const globPattern in resolutions) {
      const info = this.parsePatternInfo(globPattern, resolutions[globPattern]);

      if (info) {
        const resolution = this.resolutionsByPackage[info.name] || [];
        this.resolutionsByPackage[info.name] = [...resolution, info];
      }
    }
  }

  addToDelayQueue(req) {
    this.delayQueue.add(req);
  }

  parsePatternInfo(globPattern, range) {
    if (!isValidPackagePath(globPattern)) {
      this.reporter.warn(this.reporter.lang('invalidResolutionName', globPattern));
      return null;
    }

    const name = parsePackagePath(globPattern).pop();

    if (!semver.validRange(range) && !getExoticResolver(range)) {
      this.reporter.warn(this.reporter.lang('invalidResolutionVersion', range));
      return null;
    }

    if (name === globPattern) globPattern = `${GLOBAL_NESTED_DEP_PATTERN}${name}`;

    return {name, range, globPattern, pattern: `${name}@${range}`};
  }

  find(reqPattern, parentNames) {
    const {name, range: reqRange} = normalizePattern(reqPattern),
      resolutions = this.resolutionsByPackage[name];

    if (!resolutions) return '';

    const modulePath = [...parentNames, name].join(DIRECTORY_SEPARATOR),
      {pattern, range} = resolutions.find(({globPattern}) => minimatch(modulePath, globPattern)) || {};

    pattern &&
      semver.validRange(reqRange) && semver.valid(range) && !semver.satisfies(range, reqRange) &&
      this.reporter.warn(this.reporter.lang('incompatibleResolutionVersion', pattern, reqPattern));

    return pattern;
  }
}

const shouldUpdateLockfile = (lockfileEntry, resolutionEntry) =>
  !(!lockfileEntry || !resolutionEntry) && lockfileEntry.resolved !== resolutionEntry.remote.resolved;

class PackageResolver {
  constructor(config, lockfile, resolutionMap = new ResolutionMap(config)) {
    this.patternsByPackage = nullify();
    this.fetchingPatterns = new Set();
    this.fetchingQueue = new BlockingQueue('resolver fetching');
    this.patterns = nullify();
    this.resolutionMap = resolutionMap;
    this.usedRegistries = new Set();
    this.flat = false;

    this.reporter = config.reporter;
    this.lockfile = lockfile;
    this.config = config;
    this.delayedResolveQueue = [];
  }

  isNewPattern(pattern) {
    return !!this.patterns[pattern].fresh;
  }

  updateManifest(ref, newPkg) {
    const oldPkg = this.patterns[ref.patterns[0]];
    newPkg._reference = ref;
    newPkg._remote = ref.remote;
    newPkg.name = oldPkg.name;
    newPkg.fresh = oldPkg.fresh;
    newPkg.prebuiltVariants = oldPkg.prebuiltVariants;

    for (const pattern of ref.patterns) this.patterns[pattern] = newPkg;

    return Promise.resolve();
  }

  updateManifests(newPkgs) {
    for (const newPkg of newPkgs)
      if (newPkg._reference)
        for (const pattern of newPkg._reference.patterns) {
          const oldPkg = this.patterns[pattern];
          newPkg.prebuiltVariants = oldPkg.prebuiltVariants;

          this.patterns[pattern] = newPkg;
        }

    return Promise.resolve();
  }

  dedupePatterns(patterns) {
    const deduped = [],
      seen = new Set();

    for (const pattern of patterns) {
      const info = this.getResolvedPattern(pattern);
      if (seen.has(info)) continue;

      seen.add(info);
      deduped.push(pattern);
    }

    return deduped;
  }

  getTopologicalManifests(seedPatterns) {
    const pkgs = new Set(),
      skip = new Set();

    const add = (seedPatterns) => {
      for (const pattern of seedPatterns) {
        const pkg = this.getStrictResolvedPattern(pattern);
        if (skip.has(pkg)) continue;

        const ref = pkg._reference;
        invariant(ref, 'expected reference');
        skip.add(pkg);
        add(ref.dependencies);
        pkgs.add(pkg);
      }
    };

    add(seedPatterns);

    return pkgs;
  }

  getLevelOrderManifests(seedPatterns) {
    const pkgs = new Set(),
      skip = new Set();

    const add = (seedPatterns) => {
      const refs = [];

      for (const pattern of seedPatterns) {
        const pkg = this.getStrictResolvedPattern(pattern);
        if (skip.has(pkg)) continue;

        const ref = pkg._reference;
        invariant(ref, 'expected reference');

        refs.push(ref);
        skip.add(pkg);
        pkgs.add(pkg);
      }

      for (const ref of refs) add(ref.dependencies);
    };

    add(seedPatterns);

    return pkgs;
  }

  getAllDependencyNamesByLevelOrder(seedPatterns) {
    const names = new Set();
    for (const {name} of this.getLevelOrderManifests(seedPatterns)) names.add(name);

    return names;
  }

  getAllInfoForPackageName(name) {
    const patterns = this.patternsByPackage[name] || [];
    return this.getAllInfoForPatterns(patterns);
  }

  getAllInfoForPatterns(patterns) {
    const infos = [],
      seen = new Set();

    for (const pattern of patterns) {
      const info = this.patterns[pattern];
      if (seen.has(info)) continue;

      seen.add(info);
      infos.push(info);
    }

    return infos;
  }

  getManifests() {
    const infos = [],
      seen = new Set();

    for (const pattern in this.patterns) {
      const info = this.patterns[pattern];
      if (seen.has(info)) continue;

      infos.push(info);
      seen.add(info);
    }

    return infos;
  }

  replacePattern(pattern, newPattern) {
    const pkg = this.getResolvedPattern(pattern);
    invariant(pkg, 'missing package ' + pattern);
    const ref = pkg._reference;
    invariant(ref, 'expected package reference');
    ref.patterns = [newPattern];
    this.addPattern(newPattern, pkg);
    this.removePattern(pattern);
  }

  collapseAllVersionsOfPackage(name, version) {
    const patterns = this.dedupePatterns(this.patternsByPackage[name]);
    return this.collapsePackageVersions(name, version, patterns);
  }

  collapsePackageVersions(name, version, patterns) {
    const human = `${name}@${version}`;

    let collapseToReference, collapseToManifest, collapseToPattern;
    for (const pattern of patterns) {
      const _manifest = this.patterns[pattern];
      if (_manifest.version === version) {
        collapseToReference = _manifest._reference;
        collapseToManifest = _manifest;
        collapseToPattern = pattern;
        break;
      }
    }

    invariant(
      collapseToReference && collapseToManifest && collapseToPattern,
      "Couldn't find package manifest for " + human
    );

    for (const pattern of patterns) {
      if (pattern === collapseToPattern) continue;

      const ref = this.getStrictResolvedPattern(pattern)._reference;
      invariant(ref, 'expected package reference');
      const refPatterns = ref.patterns.slice();
      ref.prune();

      for (const pattern of refPatterns) collapseToReference.addPattern(pattern, collapseToManifest);
    }

    return collapseToPattern;
  }

  addPattern(pattern, info) {
    this.patterns[pattern] = info;

    const byName = (this.patternsByPackage[info.name] = this.patternsByPackage[info.name] || []);
    byName.indexOf(pattern) < 0 && byName.push(pattern);
  }

  removePattern(pattern) {
    const pkg = this.patterns[pattern];
    if (!pkg) return;

    const byName = this.patternsByPackage[pkg.name];
    if (!byName) return;

    byName.splice(byName.indexOf(pattern), 1);
    delete this.patterns[pattern];
  }

  getResolvedPattern(pattern) {
    return this.patterns[pattern];
  }

  getStrictResolvedPattern(pattern) {
    const manifest = this.getResolvedPattern(pattern);
    invariant(manifest, 'expected manifest');
    return manifest;
  }

  getExactVersionMatch(name, version, manifest) {
    const patterns = this.patternsByPackage[name];
    if (!patterns) return null;

    for (const pattern of patterns) {
      const info = this.getStrictResolvedPattern(pattern);
      if (info.version === version) return info;
    }

    return manifest && getExoticResolver(version)
      ? this.exoticRangeMatch(patterns.map(this.getStrictResolvedPattern.bind(this)), manifest)
      : null;
  }

  getHighestRangeVersionMatch(name, range, manifest) {
    const patterns = this.patternsByPackage[name];

    if (!patterns) return null;

    const versionNumbers = [];
    const resolvedPatterns = patterns.map((pattern) => {
      const info = this.getStrictResolvedPattern(pattern);
      versionNumbers.push(info.version);

      return info;
    });

    const maxValidRange = semver.maxSatisfying(versionNumbers, range);

    return maxValidRange
      ? resolvedPatterns[versionNumbers.indexOf(maxValidRange)]
      : manifest && getExoticResolver(range) ? this.exoticRangeMatch(resolvedPatterns, manifest) : null;
  }

  exoticRangeMatch(resolvedPkgs, manifest) {
    const remote = manifest._remote;
    if (!remote || !remote.reference || remote.type !== 'copy') return null;

    const matchedPkg = resolvedPkgs.find(
      ({_remote: pkgRemote}) => pkgRemote && pkgRemote.reference === remote.reference && pkgRemote.type === 'copy'
    );

    if (matchedPkg) manifest._remote = matchedPkg._remote;

    return matchedPkg;
  }

  isLockfileEntryOutdated(version, range, hasVersion) {
    return !(
      !semver.validRange(range) ||
      !semver.valid(version) ||
      getExoticResolver(range) ||
      !hasVersion ||
      semver.satisfies(version, range)
    );
  }

  async find(initialReq) {
    const req = this.resolveToResolution(initialReq);

    if (!req) return;

    const request = new PackageRequest(req, this),
      fetchKey = `${req.registry}:${req.pattern}:${String(req.optional)}`,
      initialFetch = !this.fetchingPatterns.has(fetchKey);
    let fresh = false;

    this.activity && this.activity.tick(req.pattern);

    if (initialFetch) {
      this.fetchingPatterns.add(fetchKey);

      const lockfileEntry = this.lockfile.getLocked(req.pattern);

      if (lockfileEntry) {
        const {range, hasVersion} = normalizePattern(req.pattern);

        if (this.isLockfileEntryOutdated(lockfileEntry.version, range, hasVersion)) {
          this.reporter.warn(this.reporter.lang('incorrectLockfileEntry', req.pattern));
          this.removePattern(req.pattern);
          this.lockfile.removePattern(req.pattern);
          fresh = true;
        }
      } else fresh = true;

      request.init();
    }

    await request.find({fresh, frozen: this.frozen});
  }

  async init(deps, {isFlat, isFrozen, workspaceLayout} = {isFlat: false, isFrozen: false, workspaceLayout: void 0}) {
    this.flat = Boolean(isFlat);
    this.frozen = Boolean(isFrozen);
    this.workspaceLayout = workspaceLayout;
    const activity = (this.activity = this.reporter.activity());

    for (const req of deps) await this.find(req);

    this.resolvePackagesWithExistingVersions();

    for (const req of this.resolutionMap.delayQueue) this.resolveToResolution(req);

    if (isFlat)
      for (const dep of deps) {
        const name = normalizePattern(dep.pattern).name;
        this.optimizeResolutions(name);
      }

    activity.end();
    this.activity = null;
  }

  optimizeResolutions(name) {
    const collapsablePatterns = this.dedupePatterns(this.patternsByPackage[name] || []).filter(pattern => {
      const remote = this.patterns[pattern]._remote;
      return !(this.lockfile.getLocked(pattern) || (remote && remote.type === 'workspace'));
    });
    if (collapsablePatterns.length < 2) return;

    const availableVersions = this.getAllInfoForPatterns(collapsablePatterns).map(manifest => manifest.version);
    availableVersions.sort(semver.rcompare);

    const ranges = collapsablePatterns.map(pattern => normalizePattern(pattern).range);

    for (const version of availableVersions)
      if (ranges.every(range => semver.satisfies(version, range))) {
        this.collapsePackageVersions(name, version, collapsablePatterns);
        return;
      }
  }

  reportPackageWithExistingVersion(req, info) {
    this.delayedResolveQueue.push({req, info});
  }

  resolvePackagesWithExistingVersions() {
    for (const {req, info} of this.delayedResolveQueue) req.resolveToExistingVersion(info);
  }

  resolveToResolution(req) {
    const {parentNames, pattern} = req;

    if (!parentNames || this.flat) return req;

    const resolution = this.resolutionMap.find(pattern, parentNames);

    if (resolution) {
      const resolutionManifest = this.getResolvedPattern(resolution);

      if (resolutionManifest) {
        invariant(resolutionManifest._reference, 'resolutions should have a resolved reference');
        resolutionManifest._reference.patterns.push(pattern);
        this.addPattern(pattern, resolutionManifest);
        const lockManifest = this.lockfile.getLocked(pattern);
        shouldUpdateLockfile(lockManifest, resolutionManifest._reference) && this.lockfile.removePattern(pattern);
      } else this.resolutionMap.addToDelayQueue(req);

      return null;
    }

    return req;
  }
}

let historyCounter = 0;

const LINK_TYPES = new Set(['workspace', 'link']);

class HoistManifest {
  constructor(key, parts, pkg, loc, isDirectRequire, isRequired, isIncompatible) {
    this.isDirectRequire = isDirectRequire;
    this.isRequired = isRequired;
    this.isIncompatible = isIncompatible;

    this.loc = loc;
    this.pkg = pkg;
    this.key = key;
    this.parts = parts;
    this.originalKey = key;
    this.previousPaths = [];

    this.history = [];
    this.addHistory('Start position = ' + key);

    this.isNohoist = false;
    this.originalParentPath = '';

    this.shallowPaths = [];
    this.isShallow = false;
  }

  addHistory(msg) {
    this.history.push(`${++historyCounter}: ${msg}`);
  }
}

class PackageHoister {
  constructor(config, resolver, {ignoreOptional, workspaceLayout} = {}) {
    this.resolver = resolver;
    this.config = config;

    this.ignoreOptional = ignoreOptional;

    this.taintedKeys = new Map();
    this.levelQueue = [];
    this.tree = new Map();

    this.workspaceLayout = workspaceLayout;

    this.nohoistResolver = new NohoistResolver(config, resolver);
  }

  taintKey(key, info) {
    const existingTaint = this.taintedKeys.get(key);
    if (existingTaint && existingTaint.loc !== info.loc) return false;

    this.taintedKeys.set(key, info);
    return true;
  }

  implodeKey(parts) {
    return parts.join('#');
  }

  seed(patterns) {
    this.prepass(patterns);

    for (const pattern of this.resolver.dedupePatterns(patterns)) this._seed(pattern, {isDirectRequire: true});

    while (1) {
      let queue = this.levelQueue;
      if (!queue.length) {
        this._propagateRequired();
        return;
      }

      this.levelQueue = [];

      queue = queue.sort(([aPattern], [bPattern]) => sortAlpha(aPattern, bPattern));

      let sortedQueue = [];
      const availableSet = new Set();

      for (let hasChanged = true; queue.length > 0 && hasChanged; ) {
        hasChanged = false;

        const queueCopy = queue;
        queue = [];
        for (let t = 0; t < queueCopy.length; ++t) {
          const queueItem = queueCopy[t],
            pattern = queueItem[0],
            pkg = this.resolver.getStrictResolvedPattern(pattern);

          if (Object.keys(pkg.peerDependencies || {}).every(peerDependency => availableSet.has(peerDependency))) {
            sortedQueue.push(queueItem);

            availableSet.add(pattern);

            hasChanged = true;
          } else queue.push(queueItem);
        }
      }

      sortedQueue = sortedQueue.concat(queue);

      for (const [pattern, parent] of sortedQueue) {
        const info = this._seed(pattern, {isDirectRequire: false, parent});
        info && this.hoist(info);
      }
    }
  }

  _seed(pattern, {isDirectRequire, parent}) {
    const pkg = this.resolver.getStrictResolvedPattern(pattern),
      ref = pkg._reference;
    invariant(ref, 'expected reference');

    let parentParts = [];

    const isIncompatible = ref.incompatible,
      isMarkedAsOptional = ref.optional && this.ignoreOptional;

    let isRequired = isDirectRequire && !ref.ignore && !isIncompatible && !isMarkedAsOptional;

    if (parent) {
      if (!this.tree.get(parent.key)) return null;

      isDirectRequire || isIncompatible || !parent.isRequired || isMarkedAsOptional || (isRequired = true);

      parentParts = parent.parts;
    }

    const loc = this.config.generateModuleCachePath(ref),
      parts = parentParts.concat(pkg.name),
      key = this.implodeKey(parts),
      info = new HoistManifest(key, parts, pkg, loc, isDirectRequire, isRequired, isIncompatible);

    this.nohoistResolver.initNohoist(info, parent);

    this.tree.set(key, info);
    this.taintKey(key, info);

    const pushed = new Set();
    for (const depPattern of ref.dependencies)
      if (!pushed.has(depPattern)) {
        this.levelQueue.push([depPattern, info]);
        pushed.add(depPattern);
      }

    return info;
  }

  _propagateRequired() {
    const toVisit = [];

    for (const entry of this.tree.entries()) entry[1].isRequired && toVisit.push(entry[1]);

    while (toVisit.length) {
      const info = toVisit.shift(),
        ref = info.pkg._reference;
      invariant(ref, 'expected reference');

      for (const depPattern of ref.dependencies) {
        const depinfo = this._lookupDependency(info, depPattern);

        if (!depinfo) continue;

        const depRef = depinfo.pkg._reference,

          isMarkedAsOptional =
            depRef && depRef.optional && this.ignoreOptional && !(info.isRequired && depRef.hint !== 'optional');

        if (!depinfo.isRequired && !depinfo.isIncompatible && !isMarkedAsOptional) {
          depinfo.isRequired = true;
          depinfo.addHistory('Mark as non-ignored because of usage by ' + info.key);
          toVisit.push(depinfo);
        }
      }
    }
  }

  _lookupDependency(info, depPattern) {
    const pkg = this.resolver.getStrictResolvedPattern(depPattern),
      ref = pkg._reference;
    invariant(ref, 'expected reference');

    for (let i = info.parts.length; i >= 0; i--) {
      const checkParts = info.parts.slice(0, i).concat(pkg.name),
        checkKey = this.implodeKey(checkParts),
        existing = this.tree.get(checkKey);
      if (existing) return existing;
    }

    return null;
  }

  getNewParts(key, info, parts) {
    let stepUp = false;

    const highestHoistingPoint = this.nohoistResolver.highestHoistingPoint(info) || 0,
      fullKey = this.implodeKey(parts),
      stack = [],
      name = parts.pop();

    info.isNohoist &&
      info.addHistory(`Marked as nohoist, will not be hoisted above '${parts[highestHoistingPoint]}'`);

    for (let i = parts.length - 1; i >= highestHoistingPoint; i--) {
      const checkParts = parts.slice(0, i).concat(name),
        checkKey = this.implodeKey(checkParts);
      info.addHistory(`Looked at ${checkKey} for a match`);

      const existing = this.tree.get(checkKey);

      if (existing) {
        if (existing.loc === info.loc) {
          if (!existing.isRequired && info.isRequired) {
            existing.addHistory(`Deduped ${fullKey} to this item, marking as required`);
            existing.isRequired = true;
          } else existing.addHistory(`Deduped ${fullKey} to this item`);

          return {parts: checkParts, duplicate: true};
        }

        info.addHistory('Found a collision at ' + checkKey);
        break;
      }

      const existingTaint = this.taintedKeys.get(checkKey);
      if (existingTaint && existingTaint.loc !== info.loc) {
        info.addHistory('Broken by ' + checkKey);
        break;
      }
    }

    const peerDependencies = Object.keys(info.pkg.peerDependencies || {});

    hoistLoop: while (parts.length > highestHoistingPoint) {
      for (const peerDependency of peerDependencies) {
        const checkParts = parts.concat(peerDependency),
          checkKey = this.implodeKey(checkParts);
        info.addHistory(`Looked at ${checkKey} for a peer dependency match`);

        if (this.tree.get(checkKey)) {
          info.addHistory('Found a peer dependency requirement at ' + checkKey);
          break hoistLoop;
        }
      }

      const checkParts = parts.concat(name),
        checkKey = this.implodeKey(checkParts);

      if (this.tree.get(checkKey)) {
        stepUp = true;
        break;
      }

      if (key !== checkKey && this.taintedKeys.has(checkKey)) {
        stepUp = true;
        break;
      }

      stack.push(parts.pop());
    }

    parts.push(name);

    const isValidPosition = (parts) => {
      if (parts.length <= highestHoistingPoint) return false;

      const key = this.implodeKey(parts),
        existing = this.tree.get(key);
      if (existing && existing.loc === info.loc) return true;

      const existingTaint = this.taintedKeys.get(key);
      return !existingTaint || existingTaint.loc === info.loc;
    };

    isValidPosition(parts) || (stepUp = true);

    while (stepUp && stack.length) {
      info.addHistory('Stepping up from ' + this.implodeKey(parts));

      parts.pop();
      parts.push(stack.pop(), name);

      if (isValidPosition(parts)) {
        info.addHistory('Found valid position ' + this.implodeKey(parts));
        stepUp = false;
      }
    }

    return {parts, duplicate: false};
  }

  hoist(info) {
    const {key: oldKey, parts: rawParts} = info;

    this.tree.delete(oldKey);
    const {parts, duplicate} = this.getNewParts(oldKey, info, rawParts.slice()),

      newKey = this.implodeKey(parts);
    if (duplicate) {
      info.addHistory('Satisfied from above by ' + newKey);

      this.declareRename(info, rawParts, parts);
      this.updateHoistHistory(this.nohoistResolver._originalPath(info), this.implodeKey(parts));
    } else if (oldKey === newKey) {
      info.addHistory("Didn't hoist - see reason above");

      this.setKey(info, oldKey, rawParts);
    } else {
      this.declareRename(info, rawParts, parts);
      this.setKey(info, newKey, parts);
    }
  }

  declareRename(info, oldParts, newParts) {
    this.taintParents(info, oldParts.slice(0, -1), newParts.length - 1);
  }

  taintParents(info, processParts, start) {
    for (let i = start; i < processParts.length; i++) {
      const parts = processParts.slice(0, i).concat(info.pkg.name),
        key = this.implodeKey(parts);

      this.taintKey(key, info) && info.addHistory(`Tainted ${key} to prevent collisions`);
    }
  }

  updateHoistHistory(fromPath, toKey) {
    const info = this.tree.get(toKey);
    invariant(info, 'expect to find hoist-to ' + toKey);
    info.previousPaths.push(fromPath);
  }

  setKey(info, newKey, parts) {
    const oldKey = info.key;

    info.key = newKey;
    info.parts = parts;
    this.tree.set(newKey, info);

    if (oldKey === newKey) return;

    const fromInfo = this.tree.get(newKey);
    invariant(fromInfo, 'expect to find hoist-from ' + newKey);
    info.previousPaths.push(this.nohoistResolver._originalPath(fromInfo));
    info.addHistory('New position = ' + newKey);
  }

  prepass(patterns) {
    patterns = this.resolver.dedupePatterns(patterns).sort();

    const visited = new Map(),
      occurences = {};

    const visitAdd = (pkg, ancestry, pattern) => {
      const versions = (occurences[pkg.name] = occurences[pkg.name] || {}),
        version = (versions[pkg.version] = versions[pkg.version] || {occurences: new Set(), pattern});

      ancestry.length && version.occurences.add(ancestry[ancestry.length - 1]);
    };

    const add = (pattern, ancestry, ancestryPatterns) => {
      const pkg = this.resolver.getStrictResolvedPattern(pattern);
      if (ancestry.indexOf(pkg) >= 0) return;

      let visitedPattern = visited.get(pattern);

      if (visitedPattern) {
        visitedPattern.forEach(visitPkg => {
          visitAdd(visitPkg.pkg, visitPkg.ancestry, visitPkg.pattern);
        });

        visitAdd(pkg, ancestry, pattern);

        return;
      }

      const ref = pkg._reference;
      invariant(ref, 'expected reference');

      visitAdd(pkg, ancestry, pattern);

      for (const depPattern of ref.dependencies) {
        const depAncestry = ancestry.concat(pkg),
          depAncestryPatterns = ancestryPatterns.concat(depPattern);
        add(depPattern, depAncestry, depAncestryPatterns);
      }

      visitedPattern = visited.get(pattern) || [];
      visited.set(pattern, visitedPattern);
      visitedPattern.push({pkg, ancestry, pattern});

      ancestryPatterns.forEach(ancestryPattern => {
        const visitedAncestryPattern = visited.get(ancestryPattern);
        visitedAncestryPattern && visitedAncestryPattern.push({pkg, ancestry, pattern});
      });
    };

    const rootPackageNames = new Set();
    for (const pattern of patterns) {
      const pkg = this.resolver.getStrictResolvedPattern(pattern);
      rootPackageNames.add(pkg.name);
      add(pattern, [], []);
    }

    for (const packageName of Object.keys(occurences).sort()) {
      const versionOccurences = occurences[packageName];

      if (Object.keys(versionOccurences).length === 1 || this.tree.get(packageName) || rootPackageNames.has(packageName))
        continue;

      let mostOccurenceCount, mostOccurencePattern;
      for (const version of Object.keys(versionOccurences).sort()) {
        const {occurences, pattern} = versionOccurences[version],
          occurenceCount = occurences.size;

        if (!mostOccurenceCount || occurenceCount > mostOccurenceCount) {
          mostOccurenceCount = occurenceCount;
          mostOccurencePattern = pattern;
        }
      }
      invariant(mostOccurencePattern, 'expected most occurring pattern');
      invariant(mostOccurenceCount, 'expected most occurring count');

      mostOccurenceCount > 1 && this._seed(mostOccurencePattern, {isDirectRequire: false});
    }
  }

  markShallowWorkspaceEntries() {
    const targetWorkspace = this.config.focusedWorkspaceName,
      targetHoistManifest = this.tree.get(targetWorkspace);
    invariant(targetHoistManifest, `targetHoistManifest from ${targetWorkspace} missing`);

    const dependentWorkspaces = Array.from(new Set(this._getDependentWorkspaces(targetHoistManifest)));

    Array.from(this.tree).forEach(([key, info]) => {
      const splitPath = key.split('#');

      if (
        dependentWorkspaces.some(w => {
          if (splitPath[0] !== w) return false;
          if (!splitPath[1]) return true;

          const treeEntry = this.tree.get(w);
          invariant(treeEntry, 'treeEntry is not defined for ' + w);
          const pkg = treeEntry.pkg;
          return !(info.isNohoist || (pkg.devDependencies && splitPath[1] in pkg.devDependencies));
        })
      ) {
        info.shallowPaths = [null];
        return;
      }

      if (splitPath.length !== 2 || splitPath[0] !== targetWorkspace) return;

      const unhoistedDependency = splitPath[1],
        unhoistedInfo = this.tree.get(unhoistedDependency);
      if (!unhoistedInfo) return;

      dependentWorkspaces.forEach(w => {
        this._packageDependsOnHoistedPackage(w, unhoistedDependency, false) && unhoistedInfo.shallowPaths.push(w);
      });
    });
  }

  _getDependentWorkspaces(parent, allowDevDeps = true, alreadySeen = new Set()) {
    const parentName = parent.pkg.name;
    if (alreadySeen.has(parentName)) return [];

    alreadySeen.add(parentName);
    invariant(this.workspaceLayout, 'missing workspaceLayout');
    const {virtualManifestName, workspaces} = this.workspaceLayout,

      directDependencies = [],
      ignored = [];
    Object.keys(workspaces).forEach(workspace => {
      if (alreadySeen.has(workspace) || workspace === virtualManifestName) return;

      let info = this.tree.get(`${parentName}#${workspace}`);
      if (info) {
        const workspaceVersion = workspaces[workspace].manifest.version;

        info.isNohoist &&
        info.originalParentPath.startsWith(`/${WS_ROOT_ALIAS}/${parentName}`) &&
        info.pkg.version === workspaceVersion
          ? directDependencies.push(info.key)
          : ignored.push(workspace);

        return;
      }

      const searchPath = `/${WS_ROOT_ALIAS}/${parentName}`;
      info = this.tree.get(workspace);
      invariant(info, 'missing workspace tree entry ' + workspace);
      if (!info.previousPaths.some(p => p.startsWith(searchPath))) return;

      (!allowDevDeps && parent.pkg.devDependencies && workspace in parent.pkg.devDependencies) ||
        directDependencies.push(workspace);
    });

    let nested = directDependencies.map(d => {
      const dependencyEntry = this.tree.get(d);
      invariant(dependencyEntry, 'missing dependencyEntry ' + d);
      return this._getDependentWorkspaces(dependencyEntry, false, alreadySeen);
    });
    nested = Array.prototype.concat.apply([], nested);

    return directDependencies.map(d => d.split('#').slice(-1)[0]).concat(nested).filter(w => ignored.indexOf(w) < 0);
  }

  _packageDependsOnHoistedPackage(p, hoisted, checkDevDeps = true, checked = new Set()) {
    if (checked.has(p) || this.tree.has(`${p}#${hoisted}`)) return false;

    checked.add(p);
    const info = this.tree.get(p);
    if (!info) return false;

    const pkg = info.pkg;
    if (!pkg) return false;

    let deps = [];
    if (pkg.dependencies) deps = deps.concat(Object.keys(pkg.dependencies));
    if (checkDevDeps && pkg.devDependencies) deps = deps.concat(Object.keys(pkg.devDependencies));

    return (
      deps.indexOf(hoisted) > -1 || deps.some(dep => this._packageDependsOnHoistedPackage(dep, hoisted, false, checked))
    );
  }

  init() {
    const flatTree = [];

    for (const [key, info] of this.tree.entries()) {
      const parts = [],
        keyParts = key.split('#'),
        isWorkspaceEntry = this.workspaceLayout && keyParts[0] === this.workspaceLayout.virtualManifestName;

      if (isWorkspaceEntry && keyParts.length <= 2) continue;

      for (let i = 0; i < keyParts.length; i++) {
        const key = keyParts.slice(0, i + 1).join('#'),
          hoisted = this.tree.get(key);
        invariant(hoisted, `expected hoisted manifest for "${key}"`);
        parts.push(this.config.getFolder(hoisted.pkg));
        parts.push(keyParts[i]);
      }

      if (this.workspaceLayout && isWorkspaceEntry) {
        const wspPkg = this.workspaceLayout.workspaces[keyParts[1]];
        invariant(wspPkg, `expected workspace package to exist for "${keyParts[1]}"`);
        parts.splice(0, 4, wspPkg.loc);
      } else
        this.config.modulesFolder
          ? parts.splice(0, 1, this.config.modulesFolder)
          : parts.splice(0, 0, this.config.lockfileFolder);

      const shallowLocs = [];
      info.shallowPaths.forEach(shallowPath => {
        const shallowCopyParts = parts.slice();
        shallowCopyParts[0] = this.config.cwd;
        if (this.config.modulesFolder) {
          const treeEntry = this.tree.get(keyParts[0]);
          invariant(treeEntry, 'expected treeEntry for ' + keyParts[0]);
          const moduleFolderName = this.config.getFolder(treeEntry.pkg);
          shallowCopyParts.splice(1, 0, moduleFolderName);
        }

        if (shallowPath) {
          const targetWorkspace = this.config.focusedWorkspaceName,
            treeEntry = this.tree.get(`${targetWorkspace}#${shallowPath}`) || this.tree.get(shallowPath);
          invariant(treeEntry, 'expected treeEntry for ' + shallowPath);
          const moduleFolderName = this.config.getFolder(treeEntry.pkg);
          shallowCopyParts.splice(1, 0, moduleFolderName, shallowPath);
        }
        shallowLocs.push(path.join(...shallowCopyParts));
      });

      const loc = path.join(...parts);
      flatTree.push([loc, info]);
      shallowLocs.forEach(shallowLoc => {
        const newManifest = {...info, isShallow: true};
        flatTree.push([shallowLoc, newManifest]);
      });
    }

    const visibleFlatTree = [];
    for (const [loc, info] of flatTree) {
      const ref = info.pkg._reference;
      invariant(ref, 'expected reference');
      info.isRequired ? visibleFlatTree.push([loc, info]) : info.addHistory('Deleted as this module was ignored');
    }
    return visibleFlatTree;
  }
}

const WS_ROOT_ALIAS = '_project_';
class NohoistResolver {
  constructor(config, resolver) {
    this._resolver = resolver;
    this._config = config;
    if (resolver.workspaceLayout) {
      this._wsRootPackageName = resolver.workspaceLayout.virtualManifestName;
      const {manifest} = resolver.workspaceLayout.getWorkspaceManifest(this._wsRootPackageName);
      this._wsRootNohoistList = this._extractNohoistList(manifest, manifest.name);
    }
  }

  initNohoist(info, parent) {
    let parentNohoistList,
      originalParentPath = info.originalParentPath;

    if (parent) {
      parentNohoistList = parent.nohoistList;
      originalParentPath = this._originalPath(parent);
    } else {
      invariant(this._isTopPackage(info), info.key + " doesn't have parent nor a top package");
      if (info.pkg.name !== this._wsRootPackageName) {
        parentNohoistList = this._wsRootNohoistList;
        originalParentPath = this._wsRootPackageName || '';
      }
    }

    info.originalParentPath = originalParentPath;
    let nohoistList = this._extractNohoistList(info.pkg, this._originalPath(info)) || [];
    if (parentNohoistList) nohoistList = nohoistList.concat(parentNohoistList);

    info.nohoistList = nohoistList.length > 0 ? nohoistList : null;
    info.isNohoist = this._isNohoist(info);
  }

  highestHoistingPoint(info) {
    return info.isNohoist && info.parts.length > 1 ? 1 : null;
  }

  _isNohoist(info) {
    return !(
      this._isTopPackage(info) ||
      (!(info.nohoistList && info.nohoistList.length > 0 && micromatch.any(this._originalPath(info), info.nohoistList)) &&
        !this._config.plugnplayEnabled)
    );
  }
  _isRootPackage(pkg) {
    return pkg.name === this._wsRootPackageName;
  }
  _originalPath(info) {
    return this._makePath(info.originalParentPath, info.pkg.name);
  }
  _makePath(...args) {
    const result = args.map(s => (s === this._wsRootPackageName ? WS_ROOT_ALIAS : s)).join('/');
    return result[0] === '/' ? result : '/' + result;
  }
  _isTopPackage(info) {
    const parentParts = info.parts.slice(0, -1);
    return (
      !parentParts ||
      parentParts.length <= 0 ||
      (parentParts.length === 1 && parentParts[0] === this._wsRootPackageName)
    );
  }
  _isLink(info) {
    return info.pkg._remote != null && LINK_TYPES.has(info.pkg._remote.type);
  }

  _extractNohoistList(pkg, pathPrefix) {
    let nohoistList;
    const ws = this._config.getWorkspaces(pkg);

    if (ws && ws.nohoist) nohoistList = ws.nohoist.map(p => this._makePath(pathPrefix, p));

    return nohoistList;
  }
}

const linkBinConcurrency = 1;

async function linkBin(src, dest) {
  if (process.platform === 'win32') {
    const unlockMutex = await lockMutex(src);
    try {
      await cmdShim(src, dest, {createPwshFile: false});
    } finally {
      unlockMutex();
    }
  } else {
    await mkdirp(path.dirname(dest));
    await symlink(src, dest);
    await chmod(dest, '755');
  }
}

class PackageLinker {
  constructor(config, resolver) {
    this.resolver = resolver;
    this.reporter = config.reporter;
    this.config = config;
    this.artifacts = {};
    this.topLevelBinLinking = true;
    this.unplugged = [];
  }

  setArtifacts(artifacts) {
    this.artifacts = artifacts;
  }

  setTopLevelBinLinking(topLevelBinLinking) {
    this.topLevelBinLinking = topLevelBinLinking;
  }

  async linkSelfDependencies(pkg, pkgLoc, targetBinLoc, override = false) {
    targetBinLoc = path.join(targetBinLoc, '.bin');
    await mkdirp(targetBinLoc);
    targetBinLoc = await realpath(targetBinLoc);
    pkgLoc = await realpath(pkgLoc);
    for (const [scriptName, scriptCmd] of entries(pkg.bin)) {
      const dest = path.join(targetBinLoc, scriptName),
        src = path.join(pkgLoc, scriptCmd);

      if ((await exists(src)) || override) await linkBin(src, dest);
    }
  }

  async linkBinDependencies(pkg, dir) {
    const deps = [],

      ref = pkg._reference;
    invariant(ref, 'Package reference is missing');

    const remote = pkg._remote;
    invariant(remote, 'Package remote is missing');

    for (const pattern of ref.dependencies) {
      const dep = this.resolver.getStrictResolvedPattern(pattern);
      if (dep._reference && dep._reference.locations.length && dep.bin && Object.keys(dep.bin).length) {
        const loc = await this.findNearestInstalledVersionOfPackage(dep, dir);
        deps.push({dep, loc});
      }
    }

    if (pkg.bundleDependencies)
      for (const depName of pkg.bundleDependencies) {
        const locs = ref.locations.map(loc => path.join(loc, this.config.getFolder(pkg), depName));
        try {
          const dep = await this.config.readManifest(locs[0], remote.registry);

          dep.bin && Object.keys(dep.bin).length && deps.push(...locs.map(loc => ({dep, loc})));
        } catch (ex) {
          if (ex.code !== 'ENOENT') throw ex;
        }
      }

    if (!deps.length) return;

    for (const {dep, loc} of deps)
      if (dep._reference && dep._reference.locations.length) {
        invariant(!dep._reference.isPlugnplay, "Plug'n'play packages should not be referenced here");
        await this.linkSelfDependencies(dep, loc, dir);
      }
  }

  async findNearestInstalledVersionOfPackage(pkg, binLoc) {
    const ref = pkg._reference;
    invariant(ref, 'expected pkg reference for ' + pkg.name);
    const moduleFolder = this.config.getFolder(pkg);
    await mkdirp(binLoc);
    const realBinLoc = await realpath(binLoc),

      allLocations = [...ref.locations];
    (await Promise.all(ref.locations.map(loc => realpath(loc)))).forEach(
      loc => allLocations.indexOf(loc) > -1 || allLocations.push(loc)
    );

    const locationBinLocPairs = allLocations.map(loc => [loc, binLoc]);
    binLoc === realBinLoc || locationBinLocPairs.push(...allLocations.map(loc => [loc, realBinLoc]));

    const filteredDistancePairs = locationBinLocPairs.map(([loc, curBinLoc]) => {
      let distance = 0,
        curLoc = curBinLoc,
        notFound = false;

      while (path.join(curLoc, ref.name) !== loc && path.join(curLoc, moduleFolder, ref.name) !== loc) {
        const next = path.dirname(curLoc);
        if (curLoc === next) {
          notFound = true;
          break;
        }

        distance++;
        curLoc = next;
      }

      return notFound ? null : [loc, distance];
    }).filter(d => d);

    invariant(filteredDistancePairs.length > 0, `could not find a copy of ${pkg.name} to link in ${binLoc}`);

    const minItem = filteredDistancePairs.reduce((min, cur) => (cur[1] < min[1] ? cur : min));

    invariant(minItem[1] >= 0, 'could not find a target for bin dir of ' + minItem.toString());
    return minItem[0];
  }

  getFlatHoistedTree(patterns, workspaceLayout, {ignoreOptional} = {}) {
    const hoister = new PackageHoister(this.config, this.resolver, {ignoreOptional, workspaceLayout});
    hoister.seed(patterns);
    this.config.focus && hoister.markShallowWorkspaceEntries();

    return hoister.init();
  }

  async copyModules(patterns, workspaceLayout, {linkDuplicates, ignoreOptional} = {}) {
    let flatTree = this.getFlatHoistedTree(patterns, workspaceLayout, {ignoreOptional});
    flatTree = flatTree.sort(function(dep1, dep2) {
      return dep1[0].localeCompare(dep2[0]);
    });

    const artifactFiles = [],

      copyQueue = new Map(),
      hardlinkQueue = new Map(),
      hardlinksEnabled = linkDuplicates && (await hardlinksWork(this.config.cwd)),

      copiedSrcs = new Map(),
      symlinkPaths = new Map();
    for (const [folder, {pkg, loc, isShallow}] of flatTree) {
      const remote = pkg._remote || {type: ''},
        ref = pkg._reference;
      let dest = folder;
      invariant(ref, 'expected package reference');

      let src = loc,
        type = '';
      if (remote.type === 'link') {
        src = remote.reference;
        type = 'symlink';
      } else if (workspaceLayout && remote.type === 'workspace' && !isShallow) {
        src = remote.reference;
        type = 'symlink';
        symlinkPaths.set(dest, src);
      } else {
        const metadata = await this.config.readPackageMetadata(src);
        for (const file of metadata.artifacts) artifactFiles.push(path.join(dest, file));
      }

      for (const [symlink, realpath] of symlinkPaths.entries())
        if (dest.indexOf(symlink + path.sep) === 0) dest = dest.replace(symlink, realpath);

      if (this.config.plugnplayEnabled) {
        ref.isPlugnplay = true;
        if (!(await this._isUnplugged(pkg, ref))) {
          ref.addLocation(src);
          continue;
        }
        dest = this.config.generatePackageUnpluggedPath(ref);

        if (await exists(dest)) {
          ref.addLocation(dest);
          continue;
        }
      }

      ref.addLocation(dest);

      const integrityArtifacts = this.artifacts[`${pkg.name}@${pkg.version}`];
      if (integrityArtifacts) for (const file of integrityArtifacts) artifactFiles.push(path.join(dest, file));

      const copiedDest = copiedSrcs.get(src);
      if (copiedDest)
        hardlinkQueue.set(dest, {
          src: copiedDest,
          dest,
          onFresh() {
            ref && ref.setFresh(true);
          },
        });
      else {
        hardlinksEnabled && type !== 'symlink' && copiedSrcs.set(src, dest);

        copyQueue.set(dest, {
          src,
          dest,
          type,
          onFresh() {
            ref && ref.setFresh(true);
          },
        });
      }
    }

    const possibleExtraneous = new Set(),
      scopedPaths = new Set();

    const findExtraneousFiles = async basePath => {
      for (const folder of this.config.registryFolders) {
        const loc = path.resolve(basePath, folder);

        if (await exists(loc)) {
          const files = await readdir(loc);

          for (const file of files) {
            const filepath = path.join(loc, file);

            if (file[0] === '@') {
              scopedPaths.add(filepath);

              for (const subfile of await readdir(filepath)) possibleExtraneous.add(path.join(filepath, subfile));
            } else
              (file[0] === '.' && file !== '.bin' && (await lstat$1(filepath)).isDirectory()) ||
                possibleExtraneous.add(filepath);
          }
        }
      }
    };

    await findExtraneousFiles(this.config.lockfileFolder);
    if (workspaceLayout)
      for (const workspaceName of Object.keys(workspaceLayout.workspaces))
        await findExtraneousFiles(workspaceLayout.workspaces[workspaceName].loc);

    const linkTargets = new Map();

    let linkedModules, tick;
    try {
      linkedModules = await readdir(this.config.linkFolder);
    } catch (err) {
      if (err.code !== 'ENOENT') throw err;

      linkedModules = [];
    }

    for (const entry of linkedModules) {
      const entryPath = path.join(this.config.linkFolder, entry),
        stat = await lstat$1(entryPath);

      if (stat.isSymbolicLink())
        try {
          const entryTarget = await realpath(entryPath);
          linkTargets.set(entry, entryTarget);
        } catch (_err) {
          this.reporter.warn(this.reporter.lang('linkTargetMissing', entry));
          await unlink(entryPath);
        }
      else if (stat.isDirectory() && entry[0] === '@') {
        const scopeName = entry;

        for (const entry2 of await readdir(entryPath)) {
          const entryPath2 = path.join(entryPath, entry2);

          if ((await lstat$1(entryPath2)).isSymbolicLink()) {
            const packageName = `${scopeName}/${entry2}`;
            try {
              const entryTarget = await realpath(entryPath2);
              linkTargets.set(packageName, entryTarget);
            } catch (_err) {
              this.reporter.warn(this.reporter.lang('linkTargetMissing', packageName));
              await unlink(entryPath2);
            }
          }
        }
      }
    }

    for (const loc of possibleExtraneous) {
      let packageName = path.basename(loc);
      const scopeName = path.basename(path.dirname(loc));

      if (scopeName[0] === '@') packageName = `${scopeName}/${packageName}`;

      if (
        (await lstat$1(loc)).isSymbolicLink() &&
        linkTargets.has(packageName) &&
        linkTargets.get(packageName) === (await realpath(loc))
      ) {
        possibleExtraneous.delete(loc);
        copyQueue.delete(loc);
      }
    }

    await copyBulk(Array.from(copyQueue.values()), this.reporter, {
      possibleExtraneous,
      artifactFiles,

      ignoreBasenames: [METADATA_FILENAME, TARBALL_FILENAME, '.bin'],

      onStart: (num) => {
        tick = this.reporter.progress(num);
      },

      onProgress(src) {
        tick && tick();
      },
    });

    await hardlinkBulk(Array.from(hardlinkQueue.values()), this.reporter, {
      possibleExtraneous,
      artifactFiles,

      onStart: (num) => {
        tick = this.reporter.progress(num);
      },

      onProgress(src) {
        tick && tick();
      },
    });

    for (const loc of possibleExtraneous) {
      this.reporter.verbose(this.reporter.lang('verboseFileRemoveExtraneous', loc));
      await unlink(loc);
    }

    for (const scopedPath of scopedPaths) (await readdir(scopedPath)).length > 0 || (await unlink(scopedPath));

    if (this.config.getOption('bin-links') && this.config.binLinks !== false) {
      const topLevelDependencies = this.determineTopLevelBinLinkOrder(flatTree),
        tickBin = this.reporter.progress(flatTree.length + topLevelDependencies.length);

      await queue(
        flatTree,
        async ([dest, {pkg, isNohoist, parts}]) => {
          if (pkg._reference && pkg._reference.locations.length && !pkg._reference.isPlugnplay) {
            const binLoc = path.join(dest, this.config.getFolder(pkg));
            await this.linkBinDependencies(pkg, binLoc);
            if (isNohoist) {
              const parentBinLoc = this.getParentBinLoc(parts, flatTree);
              await this.linkSelfDependencies(pkg, dest, parentBinLoc, true);
            }
            tickBin();
          }
          tickBin();
        },
        linkBinConcurrency
      );

      await queue(
        topLevelDependencies,
        async ([dest, {pkg}]) => {
          if (
            pkg._reference &&
            pkg._reference.locations.length &&
            !pkg._reference.isPlugnplay &&
            pkg.bin &&
            Object.keys(pkg.bin).length
          ) {
            let binLoc = this.config.modulesFolder
              ? path.join(this.config.modulesFolder)
              : path.join(this.config.lockfileFolder, this.config.getFolder(pkg));

            await this.linkSelfDependencies(pkg, dest, binLoc);
          }
          tickBin();
        },
        linkBinConcurrency
      );
    }

    for (const [, {pkg}] of flatTree) await this._warnForMissingBundledDependencies(pkg);
  }

  _buildTreeHash(flatTree) {
    const hash = new Map();
    for (const [dest, hoistManifest] of flatTree) {
      const key = hoistManifest.parts.join('#');
      hash.set(key, [dest, hoistManifest]);
    }
    this._treeHash = hash;
    return hash;
  }

  getParentBinLoc(parts, flatTree) {
    const hash = this._treeHash || this._buildTreeHash(flatTree),
      parent = parts.slice(0, -1).join('#'),
      tuple = hash.get(parent);
    if (!tuple) throw new Error(`failed to get parent '${parent}' binLoc`);

    const [dest, hoistManifest] = tuple;

    return path.join(dest, this.config.getFolder(hoistManifest.pkg));
  }

  determineTopLevelBinLinkOrder(flatTree) {
    const linksToCreate = new Map();
    for (const [dest, hoistManifest] of flatTree) {
      const {pkg, isDirectRequire, isNohoist, isShallow} = hoistManifest,
        {name} = pkg;

      isNohoist || isShallow || !(isDirectRequire || (this.topLevelBinLinking && !linksToCreate.has(name))) ||
        linksToCreate.set(name, [dest, hoistManifest]);
    }

    const transientBins = [],
      topLevelBins = [];
    for (const linkToCreate of Array.from(linksToCreate.values()))
      linkToCreate[1].isDirectRequire ? topLevelBins.push(linkToCreate) : transientBins.push(linkToCreate);

    return [...transientBins, ...topLevelBins];
  }

  resolvePeerModules() {
    for (const pkg of this.resolver.getManifests()) {
      const peerDeps = pkg.peerDependencies,
        peerDepsMeta = pkg.peerDependenciesMeta;

      if (!peerDeps) continue;

      const ref = pkg._reference;
      invariant(ref, 'Package reference is missing');

      const refTree = ref.requests.map(req => req.parentNames).sort((arr1, arr2) => arr1.length - arr2.length)[0];

      const getLevelDistance = pkgRef => {
        let minDistance = Infinity;
        for (const req of pkgRef.requests) {
          const distance = refTree.length - req.parentNames.length;

          if (distance >= 0 && distance < minDistance && req.parentNames.every((name, idx) => name === refTree[idx]))
            minDistance = distance;
        }

        return minDistance;
      };

      for (const peerDepName in peerDeps) {
        const range = peerDeps[peerDepName],
          meta = peerDepsMeta && peerDepsMeta[peerDepName],

          isOptional = !(!meta || !meta.optional),

          peerPkgs = this.resolver.getAllInfoForPackageName(peerDepName);

        let resolvedPeerPkg,
          peerError = 'unmetPeer',
          resolvedLevelDistance = Infinity;
        for (const peerPkg of peerPkgs) {
          const peerPkgRef = peerPkg._reference;
          if (!peerPkgRef || !peerPkgRef.patterns) continue;

          const levelDistance = getLevelDistance(peerPkgRef);
          if (isFinite(levelDistance) && levelDistance < resolvedLevelDistance)
            if (this._satisfiesPeerDependency(range, peerPkgRef.version)) {
              resolvedLevelDistance = levelDistance;
              resolvedPeerPkg = peerPkgRef;
            } else peerError = 'incorrectPeer';
        }

        if (resolvedPeerPkg) {
          ref.addDependencies(resolvedPeerPkg.patterns);
          this.reporter.verbose(
            this.reporter.lang(
              'selectedPeer',
              `${pkg.name}@${pkg.version}`,
              `${peerDepName}@${resolvedPeerPkg.version}`,
              resolvedPeerPkg.level
            )
          );
        } else isOptional ||
          this.reporter.warn(
            this.reporter.lang(
              peerError,
              `${refTree.join(' > ')} > ${pkg.name}@${pkg.version}`,
              `${peerDepName}@${range}`
            )
          );
      }
    }
  }

  _satisfiesPeerDependency(range, version) {
    return range === '*' || satisfiesWithPrereleases(version, range, this.config.looseSemver);
  }

  async _warnForMissingBundledDependencies(pkg) {
    const ref = pkg._reference;
    invariant(ref, 'missing package ref ' + pkg.name);

    if (pkg.bundleDependencies)
      for (const depName of pkg.bundleDependencies) {
        const locs = ref.locations.map(loc => path.join(loc, this.config.getFolder(pkg), depName));
        if ((await Promise.all(locs.map(loc => exists(loc)))).some(e => !e)) {
          const pkgHuman = `${pkg.name}@${pkg.version}`;
          this.reporter.warn(this.reporter.lang('missingBundledDependency', pkgHuman, depName));
        }
      }
  }

  _isUnplugged(pkg, ref) {
    return exists(this.config.generatePackageUnpluggedPath(ref)).then(ok =>
      !!ok ||
      !(
        this.config.ignoreScripts ||
        !pkg.scripts ||
        !(pkg.scripts.preinstall || pkg.scripts.install || pkg.scripts.postinstall)
      ) ||
      this.unplugged.some(patternToUnplug => {
        const {name, range, hasVersion} = normalizePattern(patternToUnplug),
          satisfiesSemver = !hasVersion || semver.satisfies(ref.version, range);
        return name === ref.name && satisfiesSemver;
      })
    );
  }

  async init(patterns, workspaceLayout, {linkDuplicates, ignoreOptional} = {}) {
    this.resolvePeerModules();
    await this.copyModules(patterns, workspaceLayout, {linkDuplicates, ignoreOptional});

    this.config.plugnplayEnabled || (await unlink(`${this.config.lockfileFolder}/${PNP_FILENAME}`));
  }
}

const requireLockfile = true,
  noArguments = true;

const DEFAULT_FILTER = `
# test directories
__tests__
test
tests
powered-test

# asset directories
docs
doc
website
images
assets

# examples
example
examples

# code coverage directories
coverage
.nyc_output

# build scripts
Makefile
Gulpfile.js
Gruntfile.js

# configs
appveyor.yml
circle.yml
codeship-services.yml
codeship-steps.yml
wercker.yml
.tern-project
.gitattributes
.editorconfig
.*ignore
.eslintrc
.jshintrc
.flowconfig
.documentup.json
.yarn-metadata.json
.travis.yml

# misc
*.md
`.trim();

async function clean$2(config, reporter) {
  const loc = path.join(config.lockfileFolder, CLEAN_FILENAME),
    filters = ignoreLinesToRegex((await readFile(loc)).split('\n'));

  let removedFiles = 0,
    removedSize = 0;

  const locs = new Set();
  for (const registryFolder of config.registryFolders) locs.add(path.resolve(config.lockfileFolder, registryFolder));

  const workspaceRootFolder = config.workspaceRootFolder;
  if (workspaceRootFolder) {
    const manifest = await config.findManifest(workspaceRootFolder, false);
    invariant(manifest && manifest.workspaces, 'We must find a manifest with a "workspaces" property');

    const workspaces = await config.resolveWorkspaces(workspaceRootFolder, manifest);

    for (const workspaceName of Object.keys(workspaces))
      for (const name of registryNames) {
        const registry = config.registries[name];
        locs.add(path.join(workspaces[workspaceName].loc, registry.folder));
      }
  }

  for (const folder of locs) {
    if (!(await exists(folder))) continue;

    const spinner = reporter.activity(),
      files = await walk(folder),
      {ignoreFiles} = sortFilter(files, filters);
    spinner.end();

    const tick = reporter.progress(ignoreFiles.size);

    for (const file of ignoreFiles) {
      const loc = path.join(folder, file);
      removedSize += (await lstat$1(loc)).size;
      removedFiles++;
    }

    for (const file of ignoreFiles) {
      const loc = path.join(folder, file);
      await unlink(loc);
      tick();
    }
  }

  return {removedFiles, removedSize};
}

async function runInit(cwd, reporter) {
  reporter.step(1, 1, reporter.lang('cleanCreatingFile', CLEAN_FILENAME));
  const cleanLoc = path.join(cwd, CLEAN_FILENAME);
  await writeFile(cleanLoc, DEFAULT_FILTER + '\n', {flag: 'wx'});
  reporter.info(reporter.lang('cleanCreatedFile', CLEAN_FILENAME));
}

async function runAutoClean(config, reporter) {
  reporter.step(1, 1, reporter.lang('cleaning'));
  const {removedFiles, removedSize} = await clean$2(config, reporter);
  reporter.info(reporter.lang('cleanRemovedFiles', removedFiles));
  reporter.info(reporter.lang('cleanSavedSize', Number((removedSize / 1024 / 1024).toFixed(2))));
}

function checkForCleanFile(cwd) {
  const cleanLoc = path.join(cwd, CLEAN_FILENAME);
  return exists(cleanLoc); // .then(exists$1 => exists$1)
}

async function run$4(config, reporter, flags, args) {
  const cleanFileExists = await checkForCleanFile(config.cwd);

  flags.init && cleanFileExists
    ? reporter.info(reporter.lang('cleanAlreadyExists', CLEAN_FILENAME))
    : flags.init
    ? await runInit(config.cwd, reporter)
    : flags.force && cleanFileExists
    ? await runAutoClean(config, reporter)
    : cleanFileExists
    ? reporter.info(reporter.lang('cleanRequiresForce', CLEAN_FILENAME))
    : reporter.info(reporter.lang('cleanDoesNotExist', CLEAN_FILENAME));
}

function setFlags$4(commander) {
  commander.description('Cleans and removes unnecessary files from package dependencies.');
  commander.usage('autoclean [flags]');
  commander.option('-I, --init', `Create "${CLEAN_FILENAME}" file with the default entries.`);
  commander.option('-F, --force', `Run autoclean using the existing "${CLEAN_FILENAME}" file.`);
}

function hasWrapper$4(commander) {
  return true;
}

var autoclean = {
  __proto__: null,
  requireLockfile,
  noArguments,
  clean: clean$2,
  run: run$4,
  setFlags: setFlags$4,
  hasWrapper: hasWrapper$4,
};

var pnpApi = (() => {//#!$$SHEBANG

const {statSync, lstatSync, readlinkSync, readFileSync, existsSync, realpathSync} = require('fs'),

  Module = require('module'),
  path = require('path'),
  StringDecoder = require('string_decoder'),

  ignorePattern = $$BLACKLIST ? new RegExp($$BLACKLIST) : null,

  pnpFile = path.resolve(__dirname, __filename),
  builtinModules = new Set(Module.builtinModules || Object.keys(process.binding('natives'))),

  topLevelLocator = {name: null, reference: null},
  blacklistedLocator = {name: NaN, reference: NaN},

  patchedModules = [],
  fallbackLocators = [topLevelLocator],

  backwardSlashRegExp = /\\/g,
  isDirRegExp = /\/$/,
  isStrictRegExp = /^\.{0,2}\//,
  pathRegExp = /^(?![a-zA-Z]:[\\\/]|\\\\|\.{0,2}(?:\/|$))((?:@[^\/]+\/)?[^\/]+)\/?(.*|)$/,

  pnpModule = module;

let enableNativeHooks = true;

function makeError(code, message, data = {}) {
  const error = new Error(message);
  return Object.assign(error, {code, data});
}

function blacklistCheck(locator) {
  if (locator === blacklistedLocator)
    throw makeError(
      'BLACKLISTED',
      'A package has been resolved through a blacklisted path - this is usually caused by one of your tools calling ' +
        '"realpath" on the return value of "require.resolve". Since the returned values use symlinks to disambiguate ' +
        'peer dependencies, they must be passed untransformed to "require".'
    );

  return locator;
}

$$SETUP_STATIC_TABLES();

function getIssuerModule(parent) {
  let issuer = parent;

  while (issuer && (issuer.id === '[eval]' || issuer.id === '<repl>' || !issuer.filename)) issuer = issuer.parent;

  return issuer;
}

function getPackageInformationSafe(packageLocator) {
  const packageInformation = exports.getPackageInformation(packageLocator);

  if (!packageInformation)
    throw makeError(
      'INTERNAL',
      "Couldn't find a matching entry in the dependency tree for the specified parent (this is probably an internal error)"
    );

  return packageInformation;
}

function applyNodeExtensionResolution(unqualifiedPath, {extensions}) {
  while (1) {
    let stat;

    try {
      stat = statSync(unqualifiedPath);
    } catch (_error) {}

    if (stat && !stat.isDirectory()) {
      if (lstatSync(unqualifiedPath).isSymbolicLink())
        unqualifiedPath = path.normalize(path.resolve(path.dirname(unqualifiedPath), readlinkSync(unqualifiedPath)));

      return unqualifiedPath;
    }

    if (stat && stat.isDirectory()) {
      let pkgJson, nextUnqualifiedPath;

      try {
        pkgJson = JSON.parse(readFileSync(unqualifiedPath + '/package.json', 'utf-8'));
      } catch (_error) {}

      if (pkgJson && pkgJson.main) nextUnqualifiedPath = path.resolve(unqualifiedPath, pkgJson.main);

      if (nextUnqualifiedPath && nextUnqualifiedPath !== unqualifiedPath) {
        const resolution = applyNodeExtensionResolution(nextUnqualifiedPath, {extensions});

        if (resolution !== null) return resolution;
      }
    }

    const qualifiedPath = extensions
      .map(extension => `${unqualifiedPath}${extension}`)
      .find(candidateFile => existsSync(candidateFile));

    if (qualifiedPath) return qualifiedPath;

    if (stat && stat.isDirectory()) {
      const indexPath = extensions
        .map(extension => `${unqualifiedPath}/index${extension}`)
        .find(candidateFile => existsSync(candidateFile));

      if (indexPath) return indexPath;
    }

    return null;
  }
}

function makeFakeModule(path) {
  const fakeModule = new Module(path, false);
  fakeModule.filename = path;
  fakeModule.paths = Module._nodeModulePaths(path);
  return fakeModule;
}

function normalizePath(fsPath) {
  fsPath = path.normalize(fsPath);

  if (process.platform === 'win32') fsPath = fsPath.replace(backwardSlashRegExp, '/');

  return fsPath;
}

function callNativeResolution(request, issuer) {
  if (issuer.endsWith('/')) issuer += 'internal.js';

  try {
    enableNativeHooks = false;

    return Module._resolveFilename(request, makeFakeModule(issuer), false);
  } finally {
    enableNativeHooks = true;
  }
}

exports.VERSIONS = {std: 1};
exports.topLevel = {name: null, reference: null};

exports.getPackageInformation = function({name, reference}) {
  const packageInformationStore = packageInformationStores.get(name);

  return (packageInformationStore && packageInformationStore.get(reference)) || null;
};

exports.resolveToUnqualified = function(request, issuer, {considerBuiltins = true} = {}) {
  if (request === 'pnpapi') return pnpFile;

  if (considerBuiltins && builtinModules.has(request)) return null;

  if (ignorePattern && ignorePattern.test(normalizePath(issuer))) {
    const result = callNativeResolution(request, issuer);

    if (result === false)
      throw makeError(
        'BUILTIN_NODE_RESOLUTION_FAIL',
        `The builtin node resolution algorithm was unable to resolve the module referenced by "${request}" and requested from "${issuer}" (it didn't go through the pnp resolver because the issuer was explicitely ignored by the regexp "$$BLACKLIST")`,
        {request, issuer}
      );

    return result;
  }

  let unqualifiedPath;

  const dependencyNameMatch = request.match(pathRegExp);

  dependencyNameMatch ||
    (unqualifiedPath = path.isAbsolute(request)
      ? path.normalize(request)
      : issuer.match(isDirRegExp)
      ? path.normalize(path.resolve(issuer, request))
      : path.normalize(path.resolve(path.dirname(issuer), request)));

  if (dependencyNameMatch) {
    const [, dependencyName, subPath] = dependencyNameMatch,

      issuerLocator = exports.findPackageLocator(issuer);

    if (!issuerLocator) {
      const result = callNativeResolution(request, issuer);

      if (result === false)
        throw makeError(
          'BUILTIN_NODE_RESOLUTION_FAIL',
          `The builtin node resolution algorithm was unable to resolve the module referenced by "${request}" and requested from "${issuer}" (it didn't go through the pnp resolver because the issuer doesn't seem to be part of the Yarn-managed dependency tree)`,
          {request, issuer}
        );

      return result;
    }

    const issuerInformation = getPackageInformationSafe(issuerLocator);

    let dependencyReference = issuerInformation.packageDependencies.get(dependencyName);

    if (issuerLocator !== topLevelLocator)
      for (let t = 0, T = fallbackLocators.length; dependencyReference === void 0 && t < T; ++t)
        dependencyReference = getPackageInformationSafe(fallbackLocators[t]).packageDependencies.get(dependencyName);

    if (!dependencyReference) {
      if (dependencyReference === null)
        throw issuerLocator === topLevelLocator
          ? makeError(
              'MISSING_PEER_DEPENDENCY',
              `You seem to be requiring a peer dependency ("${dependencyName}"), but it is not installed (which might be because you're the top-level package)`,
              {request, issuer, dependencyName}
            )
          : makeError(
              'MISSING_PEER_DEPENDENCY',
              `Package "${issuerLocator.name}@${issuerLocator.reference}" is trying to access a peer dependency ("${dependencyName}") that should be provided by its direct ancestor but isn't`,
              {request, issuer, issuerLocator: Object.assign({}, issuerLocator), dependencyName}
            );

      if (issuerLocator === topLevelLocator)
        throw makeError(
          'UNDECLARED_DEPENDENCY',
          `You cannot require a package ("${dependencyName}") that is not declared in your dependencies (via "${issuer}")`,
          {request, issuer, dependencyName}
        );

      const candidates = Array.from(issuerInformation.packageDependencies.keys());
      throw makeError(
        'UNDECLARED_DEPENDENCY',
        `Package "${issuerLocator.name}@${
          issuerLocator.reference
        }" (via "${issuer}") is trying to require the package "${dependencyName}" (via "${request}") without it being listed in its dependencies (${candidates.join(
          ', '
        )})`,
        {request, issuer, issuerLocator: Object.assign({}, issuerLocator), dependencyName, candidates}
      );
    }

    const dependencyLocator = {name: dependencyName, reference: dependencyReference},
      dependencyInformation = exports.getPackageInformation(dependencyLocator),
      dependencyLocation = path.resolve(__dirname, dependencyInformation.packageLocation);

    if (!dependencyLocation)
      throw makeError(
        'MISSING_DEPENDENCY',
        `Package "${dependencyLocator.name}@${dependencyLocator.reference}" is a valid dependency, but hasn't been installed and thus cannot be required (it might be caused if you install a partial tree, such as on production environments)`,
        {request, issuer, dependencyLocator: Object.assign({}, dependencyLocator)}
      );

    unqualifiedPath = subPath ? path.resolve(dependencyLocation, subPath) : dependencyLocation;
  }

  return path.normalize(unqualifiedPath);
};

exports.resolveUnqualified = function(unqualifiedPath, {extensions = Object.keys(Module._extensions)} = {}) {
  const qualifiedPath = applyNodeExtensionResolution(unqualifiedPath, {extensions});

  if (qualifiedPath) return path.normalize(qualifiedPath);

  throw makeError(
    'QUALIFIED_PATH_RESOLUTION_FAILED',
    `Couldn't find a suitable Node resolution for unqualified path "${unqualifiedPath}"`,
    {unqualifiedPath}
  );
};

exports.resolveRequest = function(request, issuer, {considerBuiltins, extensions} = {}) {
  let unqualifiedPath;

  try {
    unqualifiedPath = exports.resolveToUnqualified(request, issuer, {considerBuiltins});
  } catch (originalError) {
    if (originalError.code === 'BUILTIN_NODE_RESOLUTION_FAIL') {
      let realIssuer;

      try {
        realIssuer = realpathSync(issuer);
      } catch (_error) {}

      if (realIssuer) {
        if (issuer.endsWith('/')) realIssuer = realIssuer.replace(/\/?$/, '/');

        try {
          exports.resolveToUnqualified(request, realIssuer, {considerBuiltins});
        } catch (_error) {
          throw originalError;
        }

        throw makeError(
          'SYMLINKED_PATH_DETECTED',
          `A pnp module ("${request}") has been required from what seems to be a symlinked path ("${issuer}"). This is not possible, you must ensure that your modules are invoked through their fully resolved path on the filesystem (in this case "${realIssuer}").`,
          {request, issuer, realIssuer}
        );
      }
    }
    throw originalError;
  }

  if (unqualifiedPath === null) return null;

  try {
    return exports.resolveUnqualified(unqualifiedPath, {extensions});
  } catch (resolutionError) {
    resolutionError.code !== 'QUALIFIED_PATH_RESOLUTION_FAILED' ||
      Object.assign(resolutionError.data, {request, issuer});

    throw resolutionError;
  }
};

exports.setup = function() {
  const originalModuleLoad = Module._load;

  Module._load = function(request, parent, isMain) {
    if (!enableNativeHooks) return originalModuleLoad.call(Module, request, parent, isMain);

    if (builtinModules.has(request))
      try {
        enableNativeHooks = false;
        return originalModuleLoad.call(Module, request, parent, isMain);
      } finally {
        enableNativeHooks = true;
      }

    if (request === 'pnpapi') return pnpModule.exports;

    const modulePath = Module._resolveFilename(request, parent, isMain),

      cacheEntry = Module._cache[modulePath];

    if (cacheEntry) return cacheEntry.exports;

    const module = new Module(modulePath, parent);
    Module._cache[modulePath] = module;

    if (isMain) {
      process.mainModule = module;
      module.id = '.';
    }

    let hasThrown = true;

    try {
      module.load(modulePath);
      hasThrown = false;
    } finally {
      hasThrown && delete Module._cache[modulePath];
    }

    for (const [filter, patchFn] of patchedModules)
      if (filter.test(request))
        module.exports = patchFn(exports.findPackageLocator(parent.filename), module.exports);

    return module.exports;
  };

  const originalModuleResolveFilename = Module._resolveFilename;

  Module._resolveFilename = function(request, parent, isMain, options) {
    if (!enableNativeHooks) return originalModuleResolveFilename.call(Module, request, parent, isMain, options);

    let issuers, firstError;

    if (options) {
      const optionNames = new Set(Object.keys(options));
      optionNames.delete('paths');

      if (optionNames.size > 0)
        throw makeError(
          'UNSUPPORTED',
          `Some options passed to require() aren't supported by PnP yet (${Array.from(optionNames).join(', ')})`
        );

      if (options.paths) issuers = options.paths.map(entry => path.normalize(entry) + '/');
    }

    if (!issuers) {
      const issuerModule = getIssuerModule(parent);

      issuers = [issuerModule ? issuerModule.filename : process.cwd() + '/'];
    }

    for (const issuer of issuers) {
      let resolution;

      try {
        resolution = exports.resolveRequest(request, issuer);
      } catch (error) {
        firstError = firstError || error;
        continue;
      }

      return resolution !== null ? resolution : request;
    }

    throw firstError;
  };

  const originalFindPath = Module._findPath;

  Module._findPath = function(request, paths, isMain) {
    if (!enableNativeHooks) return originalFindPath.call(Module, request, paths, isMain);

    for (const path of paths || []) {
      let resolution;

      try {
        resolution = exports.resolveRequest(request, path);
      } catch (_error) {
        continue;
      }

      if (resolution) return resolution;
    }

    return false;
  };

  process.versions.pnp = String(exports.VERSIONS.std);
};

exports.setupCompatibilityLayer = () => {
  for (const name of ['react-scripts']) {
    const packageInformationStore = packageInformationStores.get(name);
    if (packageInformationStore)
      for (const reference of packageInformationStore.keys()) fallbackLocators.push({name, reference});
  }

  patchedModules.push([
    /^\.\/normalize-options\.js$/,
    (issuer, normalizeOptions) => {
      if (!issuer || issuer.name !== 'resolve') return normalizeOptions;

      return (request, opts) => {
        if ((opts = opts || {}).forceNodeResolution) return opts;

        opts.preserveSymlinks = true;
        opts.paths = function(request, basedir, getNodeModulesDir, opts) {
          const parts = request.match(/^((?:(@[^\/]+)\/)?([^\/]+))/);

          if (basedir.charAt(basedir.length - 1) !== '/') basedir = path.join(basedir, '/');

          const manifestPath = exports.resolveToUnqualified(parts[1] + '/package.json', basedir);

          let nodeModules = path.dirname(path.dirname(manifestPath));

          if (parts[2]) nodeModules = path.dirname(nodeModules);

          return [nodeModules];
        };

        return opts;
      };
    },
  ]);
};

if (module.parent && module.parent.id === 'internal/preload') {
  exports.setupCompatibilityLayer();

  exports.setup();
}

if (process.mainModule === module) {
  exports.setupCompatibilityLayer();

  const reportError = (code, message, data) => {
    process.stdout.write(JSON.stringify([{code, message, data}, null]) + '\n');
  };

  const reportSuccess = resolution => {
    process.stdout.write(JSON.stringify([null, resolution]) + '\n');
  };

  const processResolution = (request, issuer) => {
    try {
      reportSuccess(exports.resolveRequest(request, issuer));
    } catch (error) {
      reportError(error.code, error.message, error.data);
    }
  };

  const processRequest = data => {
    try {
      const [request, issuer] = JSON.parse(data);
      processResolution(request, issuer);
    } catch (error) {
      reportError('INVALID_JSON', error.message, error.data);
    }
  };

  if (process.argv.length > 2)
    if (process.argv.length !== 4) {
      process.stderr.write(`Usage: ${process.argv[0]} ${process.argv[1]} <request> <issuer>\n`);
      process.exitCode = 64;
    } else processResolution(process.argv[2], process.argv[3]);
  else {
    let buffer = '';
    const decoder = new StringDecoder.StringDecoder();

    process.stdin.on('data', chunk => {
      buffer += decoder.write(chunk);

      while (1) {
        const index = buffer.indexOf('\n');
        if (index < 0) break;

        const line = buffer.slice(0, index);
        buffer = buffer.slice(index + 1);

        processRequest(line);
      }
    });
  }
}
}).toString().slice(9, -1);

const backwardSlashRegExp = /\\/g,

  OFFLINE_CACHE_EXTENSION = '.zip';

function generateMaps(packageInformationStores, blacklistedLocations) {
  let code = '';

  code += 'let packageInformationStores = new Map([\n';
  for (const [packageName, packageInformationStore] of packageInformationStores) {
    code += `  [${JSON.stringify(packageName)}, new Map([\n`;

    for (const [packageReference, {packageLocation, packageDependencies}] of packageInformationStore) {
      code += `    [${JSON.stringify(packageReference)}, {
      packageLocation: path.resolve(__dirname, ${JSON.stringify(packageLocation)}),
      packageDependencies: new Map([\n`;

      for (const [dependencyName, dependencyReference] of packageDependencies.entries())
        code += `        [${JSON.stringify(dependencyName)}, ${JSON.stringify(dependencyReference)}],\n`;

      code += '      ]),\n    }],\n';
    }

    code += '  ])],\n';
  }
  code += ']);\n\n';

  code += 'let locatorsByLocations = new Map([\n';
  for (const blacklistedLocation of blacklistedLocations)
    code += `  [${JSON.stringify(blacklistedLocation)}, blacklistedLocator],\n`;

  for (const [packageName, packageInformationStore] of packageInformationStores)
    for (const [packageReference, {packageLocation}] of packageInformationStore)
      code += packageName !== null
        ? `  [${JSON.stringify(packageLocation)}, ${JSON.stringify({name: packageName, reference: packageReference})}],\n`
        : `  [${JSON.stringify(packageLocation)}, topLevelLocator],\n`;

  code += ']);\n';

  return code;
}

function generateFindPackageLocator(packageInformationStores) {
  let code = '';

  const lengths = new Map();

  for (const packageInformationStore of packageInformationStores.values())
    for (const {packageLocation} of packageInformationStore.values()) {
      if (packageLocation === null) continue;

      const length = packageLocation.length,
        count = (lengths.get(length) || 0) + 1;

      lengths.set(length, count);
    }

  const sortedLengths = Array.from(lengths.entries()).sort((a, b) => b[0] - a[0]);

  code += `exports.findPackageLocator = function(location) {
  let relativeLocation = normalizePath(path.relative(__dirname, location));

  relativeLocation.match(isStrictRegExp) || (relativeLocation = './' + relativeLocation);

  if (location.match(isDirRegExp) && relativeLocation.charAt(relativeLocation.length - 1) !== '/')
    relativeLocation += '/';

  let match;\n`;

  for (const [length] of sortedLengths)
    code += `
  if (relativeLocation.length >= ${length} && relativeLocation[${length - 1}] === '/' &&
      (match = locatorsByLocations.get(relativeLocation.substr(0, ${length}))))
    return blacklistCheck(match);\n`;

  code += '\n  return null;\n};\n';

  return code;
}

async function getPackageInformationStores(config, seedPatterns, {resolver, reporter, targetPath, workspaceLayout}) {
  const targetDirectory = path.dirname(targetPath),
    offlineCacheFolder = config.offlineCacheFolder,

    packageInformationStores = new Map(),
    blacklistedLocations = new Set();

  const getCachePath = (fsPath) => {
    const cacheRelativePath = normalizePath(path.relative(config.cacheFolder, fsPath));

    return cacheRelativePath.match(/^\.\.\//) ? null : cacheRelativePath;
  };

  const resolveOfflineCacheFolder = (fsPath) => {
    if (!offlineCacheFolder) return fsPath;

    const cacheRelativePath = getCachePath(fsPath);

    if (!cacheRelativePath) return fsPath;

    const components = cacheRelativePath.split(/\//g),
      [cacheEntry, ...internalPath] = components;

    return path.resolve(offlineCacheFolder, `${cacheEntry}${OFFLINE_CACHE_EXTENSION}`, internalPath.join('/'));
  };

  const normalizePath = (fsPath) => (process.platform === 'win32' ? fsPath.replace(backwardSlashRegExp, '/') : fsPath);

  const normalizeDirectoryPath = (fsPath) => {
    let relativePath = normalizePath(path.relative(targetDirectory, resolveOfflineCacheFolder(fsPath)));

    relativePath.match(/^\.{0,2}\//) || path.isAbsolute(relativePath) || (relativePath = './' + relativePath);

    return relativePath.replace(/\/?$/, '/');
  };

  const getHashFrom = (data) => {
    const hashGenerator = crypto.createHash('sha1');

    for (const datum of data) hashGenerator.update(datum);

    return hashGenerator.digest('hex');
  };

  const getResolverEntry = pattern => {
    const pkg = resolver.getStrictResolvedPattern(pattern),
      ref = pkg._reference;

    if (!ref) return null;

    invariant(ref.locations.length <= 1, 'Must have at most one location (usually in the cache)');
    const loc = ref.locations[0];

    return loc ? {pkg, ref, loc} : null;
  };

  const visit = async (precomputedResolutions, seedPatterns, parentData = []) => {
    const resolutions = new Map(precomputedResolutions),
      locations = new Map();

    for (const pattern of seedPatterns) {
      const entry = getResolverEntry(pattern);
      if (!entry) continue;

      const {pkg, ref} = entry;
      let {loc} = entry;

      const packageName = pkg.name;
      let packageReference = pkg.version;

      if (new Set(Array.from(Object.keys(pkg.peerDependencies || {}))).size > 0 && ref.requests.length > 1) {
        const hash = getHashFrom([...parentData, packageName, packageReference]);

        let symlinkSource, symlinkFile;

        switch (ref.remote.type) {
          case 'workspace':
            symlinkSource = loc;
            symlinkFile = path.resolve(config.lockfileFolder, '.pnp', 'workspaces', 'pnp-' + hash, packageName);

            loc = symlinkFile;
            break;

          default:
            const isFromCache = getCachePath(loc),

              hashName = isFromCache && offlineCacheFolder ? `pnp-${hash}${OFFLINE_CACHE_EXTENSION}` : 'pnp-' + hash;
            const newLoc = path.resolve(
              config.lockfileFolder,
              '.pnp',
              'externals',
              hashName,
              'node_modules',
              packageName
            );

            if (isFromCache) {
              const getBase = source => path.resolve(source, '../'.repeat(1 + packageName.split('/').length));
              symlinkSource = resolveOfflineCacheFolder(getBase(loc));
              symlinkFile = getBase(newLoc);
            } else {
              symlinkSource = loc;
              symlinkFile = newLoc;
            }

            loc = newLoc;
            break;
        }

        await mkdirp(path.dirname(symlinkFile));
        await symlink(symlinkSource, symlinkFile);

        packageReference = 'pnp:' + hash;

        blacklistedLocations.add(normalizeDirectoryPath(loc));
      }

      resolutions.set(packageName, packageReference);
      locations.set(packageName, loc);
    }

    for (const pattern of seedPatterns) {
      const entry = getResolverEntry(pattern);
      if (!entry) continue;

      const {pkg, ref} = entry,

        packageName = pkg.name,

        packageReference = resolutions.get(packageName);
      invariant(packageReference, 'Package reference should have been computed during the pre-pass');

      const loc = locations.get(packageName);
      invariant(loc, 'Package location should have been computed during the pre-pass');

      let packageInformationStore = packageInformationStores.get(packageName);

      if (!packageInformationStore) {
        packageInformationStore = new Map();
        packageInformationStores.set(packageName, packageInformationStore);
      }

      let packageInformation = packageInformationStore.get(packageReference);
      if (packageInformation) continue;

      packageInformation = {packageLocation: normalizeDirectoryPath(loc), packageDependencies: new Map()};

      const peerDependencies = new Set(Array.from(Object.keys(pkg.peerDependencies || {})));
      const directDependencies = ref.dependencies.filter(pattern => {
        const pkg = resolver.getStrictResolvedPattern(pattern);
        return !pkg || !peerDependencies.has(pkg.name);
      });

      packageInformationStore.set(packageReference, packageInformation);

      for (const dependencyName of peerDependencies) {
        const dependencyReference = resolutions.get(dependencyName);

        dependencyReference && packageInformation.packageDependencies.set(dependencyName, dependencyReference);
      }

      const childResolutions = await visit(packageInformation.packageDependencies, directDependencies, [
        packageName,
        packageReference,
      ]);

      for (const [name, reference] of childResolutions.entries())
        packageInformation.packageDependencies.set(name, reference);

      packageInformation.packageDependencies.has(packageName) ||
        packageInformation.packageDependencies.set(packageName, packageReference);
    }

    return resolutions;
  };

  if (workspaceLayout)
    for (const name of Object.keys(workspaceLayout.workspaces)) {
      const pkg = workspaceLayout.workspaces[name].manifest;
      if (pkg.workspaces) continue;

      const ref = pkg._reference;
      invariant(ref, 'Workspaces should have a reference');

      invariant(ref.locations.length === 1, 'Workspaces should have exactly one location');
      const loc = ref.locations[0];
      invariant(loc, 'Workspaces should have a location');

      let packageInformationStore = packageInformationStores.get(name);

      if (!packageInformationStore) {
        packageInformationStore = new Map();
        packageInformationStores.set(name, packageInformationStore);
      }

      packageInformationStore.set(pkg.version, {
        packageLocation: normalizeDirectoryPath(loc),
        packageDependencies: await visit(new Map(), ref.dependencies, [name, pkg.version]),
      });
    }

  packageInformationStores.set(
    null,
    new Map([
      [
        null,
        {
          packageLocation: normalizeDirectoryPath(config.lockfileFolder),
          packageDependencies: await visit(new Map(), seedPatterns),
        },
      ],
    ])
  );

  return [packageInformationStores, blacklistedLocations];
}

async function generatePnpMap(config, seedPatterns, {resolver, reporter, workspaceLayout, targetPath}) {
  const [packageInformationStores, blacklistedLocations] = await getPackageInformationStores(config, seedPatterns, {
    resolver,
    reporter,
    targetPath,
    workspaceLayout,
  });

  const setupStaticTables = [
    generateMaps(packageInformationStores, blacklistedLocations),
    generateFindPackageLocator(packageInformationStores),
  ].join('');

  return pnpApi
    .replace(/\$\$SHEBANG/g, config.plugnplayShebang)
    .replace(/\$\$BLACKLIST/g, JSON.stringify(config.plugnplayBlacklist))
    .replace(/\$\$SETUP_STATIC_TABLES\(\);/g, setupStaticTables);
}

function getParent(key, treesByKey) {
  return treesByKey[key.slice(0, key.lastIndexOf('#'))];
}

async function buildTree(resolver, linker, patterns, ignoreHoisted) {
  const treesByKey = {},
    trees = [],
    flatTree = await linker.getFlatHoistedTree(patterns),

    {workspaceLayout} = resolver;
  const hoisted =
    workspaceLayout && workspaceLayout.virtualManifestName
      ? flatTree.filter(([key]) => key.indexOf(workspaceLayout.virtualManifestName) < 0)
      : flatTree;
  for (const [key, info] of hoisted);

  for (const [, info] of hoisted) {
    const ref = info.pkg._reference,
      children = [];
    invariant(ref, 'expected reference');

    treesByKey[info.key] = {name: info.pkg.name, version: info.pkg.version, children, manifest: info};
  }

  for (const [, info] of hoisted) {
    const tree = treesByKey[info.key],
      parent = getParent(info.key, treesByKey);

    if (tree) info.key.split('#').length === 1 ? trees.push(tree) : parent && parent.children.push(tree);
  }

  return trees;
}

function dependenciesObjectToPatterns(dependencies) {
  return dependencies ? Object.keys(dependencies).map(name => `${name}@${(dependencies || {})[name]}`) : [];
}

function getTransitiveDependencies(lockfile, roots) {
  const queue = [],
    patterns = new Set();

  const enqueue = (pattern) => {
    if (patterns.has(pattern)) return;

    patterns.add(pattern);
    queue.push(pattern);
  };

  roots.forEach(enqueue);

  const transitiveDependencies = new Set();

  while (queue.length > 0) {
    const pattern = queue.shift(),
      lockManifest = lockfile.getLocked(pattern);

    if (!lockManifest) continue;

    transitiveDependencies.add(`${lockManifest.name}@${lockManifest.version}`);

    dependenciesObjectToPatterns(lockManifest.dependencies).forEach(enqueue);

    dependenciesObjectToPatterns(lockManifest.optionalDependencies).forEach(enqueue);
  }

  return transitiveDependencies;
}

function setDifference(x, y) {
  return new Set([...x].filter(value => !y.has(value)));
}

function getTransitiveDevDependencies(packageManifest, workspaceLayout, lockfile) {
  const manifests = [packageManifest];
  if (workspaceLayout)
    for (const name of Object.keys(workspaceLayout.workspaces))
      manifests.push(workspaceLayout.workspaces[name].manifest);

  let productionRoots = [],
    developmentRoots = [];
  for (const manifest of manifests) {
    productionRoots = productionRoots.concat(dependenciesObjectToPatterns(manifest.dependencies));
    productionRoots = productionRoots.concat(dependenciesObjectToPatterns(manifest.optionalDependencies));
    developmentRoots = developmentRoots.concat(dependenciesObjectToPatterns(manifest.devDependencies));
  }

  const productionDependencies = getTransitiveDependencies(lockfile, productionRoots);

  return setDifference(getTransitiveDependencies(lockfile, developmentRoots), productionDependencies);
}

const gzip = promisify(zlib.gzip);

function setFlags$5(commander) {
  commander.description('Checks for known security issues with the installed packages.');
  commander.option('--summary', 'Only print the summary.');
  commander.option(
    '--groups <group_name> [<group_name> ...]',
    'Only audit dependencies from listed groups. Default: ' + OWNED_DEPENDENCY_TYPES.join(', '),
    groups => groups.split(' '),
    OWNED_DEPENDENCY_TYPES
  );
  commander.option(
    '--level <severity>',
    'Only print advisories with severity greater than or equal to one of the following: \
    info|low|moderate|high|critical. Default: info',
    'info'
  );
}

function hasWrapper$5(commander, args) {
  return true;
}

async function run$5(config, reporter, flags, args) {
  const DEFAULT_LOG_LEVEL = 'info';
  const audit = new Audit(config, reporter, {
    groups: flags.groups || OWNED_DEPENDENCY_TYPES,
    level: flags.level || DEFAULT_LOG_LEVEL,
  });
  const lockfile = await Lockfile.fromDirectory(config.lockfileFolder, reporter),
    install = new Install({}, config, reporter, lockfile),
    {manifest, requests, patterns, workspaceLayout} = await install.fetchRequestFromCwd();
  await install.resolver.init(requests, {workspaceLayout});

  const vulnerabilities = await audit.performAudit(manifest, lockfile, install.resolver, install.linker, patterns),

    EXIT_INFO = 1,
    EXIT_LOW = 2,
    EXIT_MODERATE = 4,
    EXIT_HIGH = 8,
    EXIT_CRITICAL = 16;

  const exitCode =
    (vulnerabilities.info ? EXIT_INFO : 0) +
    (vulnerabilities.low ? EXIT_LOW : 0) +
    (vulnerabilities.moderate ? EXIT_MODERATE : 0) +
    (vulnerabilities.high ? EXIT_HIGH : 0) +
    (vulnerabilities.critical ? EXIT_CRITICAL : 0);

  flags.summary ? audit.summary() : audit.report();

  return exitCode;
}

class Audit {
  severityLevels = ['info', 'low', 'moderate', 'high', 'critical'];

  constructor(config, reporter, options) {
    this.config = config;
    this.reporter = reporter;
    this.options = options;
  }

  _mapHoistedNodes(auditNode, hoistedNodes, transitiveDevDeps) {
    for (const node of hoistedNodes) {
      const pkg = node.manifest.pkg,
        requires = Object.assign({}, pkg.dependencies || {}, pkg.optionalDependencies || {});
      for (const name of Object.keys(requires)) requires[name] || (requires[name] = '*');

      auditNode.dependencies[node.name] = {
        version: node.version,
        integrity: (pkg._remote && pkg._remote.integrity) || '',
        requires,
        dependencies: {},
        dev: transitiveDevDeps.has(`${node.name}@${node.version}`),
      };
      node.children && this._mapHoistedNodes(auditNode.dependencies[node.name], node.children, transitiveDevDeps);
    }
  }

  _mapHoistedTreesToAuditTree(manifest, hoistedTrees, transitiveDevDeps) {
    const requiresGroups = this.options.groups.map(function(group) {
      return manifest[group] || {};
    });

    const auditTree = {
      name: manifest.name || void 0,
      version: manifest.version || void 0,
      install: [],
      remove: [],
      metadata: {},
      requires: Object.assign({}, ...requiresGroups),
      integrity: void 0,
      dependencies: {},
      dev: false,
    };

    this._mapHoistedNodes(auditTree, hoistedTrees, transitiveDevDeps);
    return auditTree;
  }

  async _fetchAudit(auditTree) {
    let responseJson;
    const registry = YARN_REGISTRY;
    this.reporter.verbose('Audit Request: ' + JSON.stringify(auditTree, null, 2));
    const requestBody = await gzip(JSON.stringify(auditTree));
    const response = await this.config.requestManager.request({
      url: registry + '/-/npm/v1/security/audits',
      method: 'POST',
      body: requestBody,
      headers: {'Content-Encoding': 'gzip', 'Content-Type': 'application/json', Accept: 'application/json'},
    });

    try {
      responseJson = JSON.parse(response);
    } catch (_ex) {
      throw new Error('Unexpected audit response (Invalid JSON): ' + response);
    }
    if (!responseJson.metadata)
      throw new Error('Unexpected audit response (Missing Metadata): ' + JSON.stringify(responseJson, null, 2));

    this.reporter.verbose('Audit Response: ' + JSON.stringify(responseJson, null, 2));
    return responseJson;
  }

  _insertWorkspacePackagesIntoManifest(manifest, resolver) {
    if (resolver.workspaceLayout) {
      const workspaceAggregatorName = resolver.workspaceLayout.virtualManifestName,
        workspaceManifest = resolver.workspaceLayout.workspaces[workspaceAggregatorName].manifest;

      manifest.dependencies = Object.assign(manifest.dependencies || {}, workspaceManifest.dependencies);
      manifest.devDependencies = Object.assign(manifest.devDependencies || {}, workspaceManifest.devDependencies);
      manifest.optionalDependencies = Object.assign(
        manifest.optionalDependencies || {},
        workspaceManifest.optionalDependencies
      );
    }
  }

  async performAudit(manifest, lockfile, resolver, linker, patterns) {
    this._insertWorkspacePackagesIntoManifest(manifest, resolver);
    const transitiveDevDeps = getTransitiveDevDependencies(manifest, resolver.workspaceLayout, lockfile),
      hoistedTrees = await buildTree(resolver, linker, patterns),
      auditTree = this._mapHoistedTreesToAuditTree(manifest, hoistedTrees, transitiveDevDeps);
    this.auditData = await this._fetchAudit(auditTree);
    return this.auditData.metadata.vulnerabilities;
  }

  summary() {
    this.auditData && this.reporter.auditSummary(this.auditData.metadata);
  }

  report() {
    if (!this.auditData) return;

    const startLoggingAt = Math.max(0, this.severityLevels.indexOf(this.options.level));

    const reportAdvisory = (resolution) => {
      const advisory = this.auditData.advisories[resolution.id.toString()];

      this.severityLevels.indexOf(advisory.severity) < startLoggingAt ||
        this.reporter.auditAdvisory(resolution, advisory);
    };

    Object.keys(this.auditData.advisories).length > 0 &&
      this.auditData.actions.forEach(action => {
        action.resolves.forEach(reportAdvisory);
      });

    this.summary();
  }
}

var audit = {
  __proto__: null,
  setFlags: setFlags$5,
  hasWrapper: hasWrapper$5,
  run: run$5,
  default: Audit,
};

const ONE_DAY = 86400000;

function getUpdateCommand(installationMethod) {
  return installationMethod === 'tar'
    ? `curl --compressed -o- -L ${YARN_INSTALLER_SH} | bash`
    : installationMethod === 'homebrew'
    ? 'brew upgrade yarn'
    : installationMethod === 'deb'
    ? 'sudo apt-get update && sudo apt-get install yarn'
    : installationMethod === 'rpm'
    ? 'sudo yum install yarn'
    : installationMethod === 'npm'
    ? 'npm install --global yarn'
    : installationMethod === 'chocolatey'
    ? 'choco upgrade yarn'
    : installationMethod === 'apk'
    ? 'apk update && apk add -u yarn'
    : installationMethod === 'portage'
    ? 'sudo emerge --sync && sudo emerge -au sys-apps/yarn'
    : null;
}

function getUpdateInstaller(installationMethod) {
  return installationMethod === 'msi' ? YARN_INSTALLER_MSI : null;
}

function normalizeFlags(config, rawFlags) {
  const flags = {
    har: !!rawFlags.har,
    ignorePlatform: !!rawFlags.ignorePlatform,
    ignoreEngines: !!rawFlags.ignoreEngines,
    ignoreScripts: !!rawFlags.ignoreScripts,
    ignoreOptional: !!rawFlags.ignoreOptional,
    force: !!rawFlags.force,
    flat: !!rawFlags.flat,
    lockfile: rawFlags.lockfile !== false,
    pureLockfile: !!rawFlags.pureLockfile,
    updateChecksums: !!rawFlags.updateChecksums,
    skipIntegrityCheck: !!rawFlags.skipIntegrityCheck,
    frozenLockfile: !!rawFlags.frozenLockfile,
    linkDuplicates: !!rawFlags.linkDuplicates,
    checkFiles: !!rawFlags.checkFiles,
    audit: !!rawFlags.audit,

    peer: !!rawFlags.peer,
    dev: !!rawFlags.dev,
    optional: !!rawFlags.optional,
    exact: !!rawFlags.exact,
    tilde: !!rawFlags.tilde,
    ignoreWorkspaceRootCheck: !!rawFlags.ignoreWorkspaceRootCheck,

    includeWorkspaceDeps: !!rawFlags.includeWorkspaceDeps,

    workspaceRootIsCwd: rawFlags.workspaceRootIsCwd !== false,
  };

  if (config.getOption('ignore-scripts')) flags.ignoreScripts = true;

  if (config.getOption('ignore-platform')) flags.ignorePlatform = true;

  if (config.getOption('ignore-engines')) flags.ignoreEngines = true;

  if (config.getOption('ignore-optional')) flags.ignoreOptional = true;

  if (config.getOption('force')) flags.force = true;

  return flags;
}

class Install {
  constructor(flags, config, reporter, lockfile) {
    this.rootManifestRegistries = [];
    this.rootPatternsToOrigin = nullify();
    this.lockfile = lockfile;
    this.reporter = reporter;
    this.config = config;
    this.flags = normalizeFlags(config, flags);
    this.resolutions = nullify();
    this.resolutionMap = new ResolutionMap(config);
    this.resolver = new PackageResolver(config, lockfile, this.resolutionMap);
    this.integrityChecker = new InstallationIntegrityChecker(config);
    this.linker = new PackageLinker(config, this.resolver);
    this.scripts = new PackageInstallScripts(config, this.resolver, this.flags.force);
  }

  async fetchRequestFromCwd(excludePatterns = [], ignoreUnusedPatterns = false) {
    const patterns = [],
      deps = [];
    let resolutionDeps = [];
    const manifest = {},

      ignorePatterns = [],
      usedPatterns = [];
    let workspaceLayout;

    const cwd =
        this.flags.includeWorkspaceDeps || this.flags.workspaceRootIsCwd ? this.config.lockfileFolder : this.config.cwd,

      cwdIsRoot = !this.config.workspaceRootFolder || this.config.lockfileFolder === cwd,

      excludeNames = [];
    for (const pattern of excludePatterns)
      if (getExoticResolver(pattern)) excludeNames.push(guessName(pattern));
      else {
        const parts = normalizePattern(pattern);
        excludeNames.push(parts.name);
      }

    const stripExcluded = (manifest) => {
      for (const exclude of excludeNames) {
        manifest.dependencies && manifest.dependencies[exclude] && delete manifest.dependencies[exclude];

        manifest.devDependencies && manifest.devDependencies[exclude] && delete manifest.devDependencies[exclude];

        manifest.optionalDependencies && manifest.optionalDependencies[exclude] &&
          delete manifest.optionalDependencies[exclude];
      }
    };

    for (const registry of Object.keys(registries)) {
      const {filename} = registries[registry],
        loc = path.join(cwd, filename);
      if (!(await exists(loc))) continue;

      this.rootManifestRegistries.push(registry);

      const projectManifestJson = await this.config.readJson(loc);
      await normalizeManifest(projectManifestJson, cwd, this.config, cwdIsRoot);

      Object.assign(this.resolutions, projectManifestJson.resolutions);
      Object.assign(manifest, projectManifestJson);

      this.resolutionMap.init(this.resolutions);
      for (const packageName of Object.keys(this.resolutionMap.resolutionsByPackage)) {
        const optional = objectPath.has(manifest.optionalDependencies, packageName) && this.flags.ignoreOptional;
        for (const {pattern} of this.resolutionMap.resolutionsByPackage[packageName])
          resolutionDeps = [...resolutionDeps, {registry, pattern, optional, hint: 'resolution'}];
      }

      const pushDeps = (depType, manifest, {hint, optional}, isUsed) => {
        if ((ignoreUnusedPatterns && !isUsed) || (this.flags.flat && !isUsed)) return;

        const depMap = manifest[depType];
        for (const name in depMap) {
          if (excludeNames.indexOf(name) >= 0) continue;

          let pattern = name;
          this.lockfile.getLocked(pattern) || (pattern += '@' + depMap[name]);

          isUsed ? usedPatterns.push(pattern) : ignorePatterns.push(pattern);

          this.rootPatternsToOrigin[pattern] = depType;
          patterns.push(pattern);
          deps.push({pattern, registry, hint, optional, workspaceName: manifest.name, workspaceLoc: manifest._loc});
        }
      };

      if (cwdIsRoot) {
        pushDeps('dependencies', projectManifestJson, {hint: null, optional: false}, true);
        pushDeps('devDependencies', projectManifestJson, {hint: 'dev', optional: false}, !this.config.production);
        pushDeps('optionalDependencies', projectManifestJson, {hint: 'optional', optional: true}, true);
      }

      if (this.config.workspaceRootFolder) {
        const workspaceLoc = cwdIsRoot ? loc : path.join(this.config.lockfileFolder, filename),
          workspacesRoot = path.dirname(workspaceLoc);

        let workspaceManifestJson = projectManifestJson;
        if (!cwdIsRoot) {
          workspaceManifestJson = await this.config.readJson(workspaceLoc);
          await normalizeManifest(workspaceManifestJson, workspacesRoot, this.config, true);
        }

        const workspaces = await this.config.resolveWorkspaces(workspacesRoot, workspaceManifestJson);
        workspaceLayout = new WorkspaceLayout(workspaces, this.config);

        const workspaceDependencies = {...workspaceManifestJson.dependencies};
        for (const workspaceName of Object.keys(workspaces)) {
          const workspaceManifest = workspaces[workspaceName].manifest;
          workspaceDependencies[workspaceName] = workspaceManifest.version;

          if (this.flags.includeWorkspaceDeps) {
            pushDeps('dependencies', workspaceManifest, {hint: null, optional: false}, true);
            pushDeps('devDependencies', workspaceManifest, {hint: 'dev', optional: false}, !this.config.production);
            pushDeps('optionalDependencies', workspaceManifest, {hint: 'optional', optional: true}, true);
          }
        }
        const virtualDependencyManifest = {
          _uid: '',
          name: 'workspace-aggregator-' + uuid.v4(),
          version: '1.0.0',
          _registry: 'npm',
          _loc: workspacesRoot,
          dependencies: workspaceDependencies,
          devDependencies: {...workspaceManifestJson.devDependencies},
          optionalDependencies: {...workspaceManifestJson.optionalDependencies},
          private: workspaceManifestJson.private,
          workspaces: workspaceManifestJson.workspaces,
        };
        workspaceLayout.virtualManifestName = virtualDependencyManifest.name;
        const virtualDep = {};
        virtualDep[virtualDependencyManifest.name] = virtualDependencyManifest.version;
        workspaces[virtualDependencyManifest.name] = {loc: workspacesRoot, manifest: virtualDependencyManifest};

        stripExcluded(cwdIsRoot ? virtualDependencyManifest : workspaces[projectManifestJson.name].manifest);

        pushDeps('workspaces', {workspaces: virtualDep}, {hint: 'workspaces', optional: false}, true);

        const implicitWorkspaceDependencies = {...workspaceDependencies};

        for (const type of OWNED_DEPENDENCY_TYPES)
          for (const dependencyName of Object.keys(projectManifestJson[type] || {}))
            delete implicitWorkspaceDependencies[dependencyName];

        pushDeps(
          'dependencies',
          {dependencies: implicitWorkspaceDependencies},
          {hint: 'workspaces', optional: false},
          true
        );
      }

      break;
    }

    if (manifest.flat) this.flags.flat = true;

    return {
      requests: [...resolutionDeps, ...deps],
      patterns,
      manifest,
      usedPatterns,
      ignorePatterns,
      workspaceLayout,
    };
  }

  prepareRequests(requests) {
    return requests;
  }

  preparePatterns(patterns) {
    return patterns;
  }
  preparePatternsForLinking(patterns, cwdManifest, cwdIsRoot) {
    return patterns;
  }

  prepareManifests() {
    return this.config.getRootManifests(); // .then(manifests => manifests)
  }

  async bailout(patterns, workspaceLayout) {
    if (this.flags.audit || this.config.plugnplayEnabled || this.flags.skipIntegrityCheck || this.flags.force)
      return false;

    const lockfileCache = this.lockfile.cache;
    if (!lockfileCache) return false;

    const lockfileClean = this.lockfile.parseResultType === 'success',
      match = await this.integrityChecker.check(patterns, lockfileCache, this.flags, workspaceLayout);
    if (this.flags.frozenLockfile && (!lockfileClean || match.missingPatterns.length > 0))
      throw new MessageError(this.reporter.lang('frozenLockfileError'));

    const haveLockfile = await exists(path.join(this.config.lockfileFolder, LOCKFILE_FILENAME)),

      integrityBailout = !this.lockfile.hasEntriesExistWithoutIntegrity() || !this.config.autoAddIntegrity;

    if (match.integrityMatches && haveLockfile && lockfileClean && integrityBailout) {
      this.reporter.success(this.reporter.lang('upToDate'));
      return true;
    }

    if (match.integrityFileMissing && haveLockfile) {
      this.scripts.setForce(true);
      return false;
    }

    if (match.hardRefreshRequired) {
      this.scripts.setForce(true);
      return false;
    }

    if (!patterns.length && !match.integrityFileMissing) {
      this.reporter.success(this.reporter.lang('nothingToInstall'));
      await this.createEmptyManifestFolders();
      await this.saveLockfileAndIntegrity(patterns, workspaceLayout);
      return true;
    }

    return false;
  }

  async createEmptyManifestFolders() {
    if (this.config.modulesFolder) return;

    for (const registryName of this.rootManifestRegistries) {
      const {folder} = this.config.registries[registryName];
      await mkdirp(path.join(this.config.lockfileFolder, folder));
    }
  }

  markIgnored(patterns) {
    for (const pattern of patterns) {
      const ref = this.resolver.getStrictResolvedPattern(pattern)._reference;
      invariant(ref, 'expected package reference');

      ref.ignore = true;
    }
  }

  async getFlattenedDeps() {
    const {requests: depRequests, patterns: rawPatterns} = await this.fetchRequestFromCwd();

    await this.resolver.init(depRequests, {});

    const manifests = await fetch(this.resolver.getManifests(), this.config);
    this.resolver.updateManifests(manifests);

    return this.flatten(rawPatterns);
  }

  async init() {
    this.checkUpdate();

    if (await exists(path.join(this.config.lockfileFolder, NPM_SHRINKWRAP_FILENAME)))
      this.reporter.warn(this.reporter.lang('shrinkwrapWarning'));

    if (await exists(path.join(this.config.lockfileFolder, NPM_LOCK_FILENAME)))
      this.reporter.warn(this.reporter.lang('npmLockfileWarning'));

    if (this.config.plugnplayEnabled) {
      this.reporter.info(this.reporter.lang('plugnplaySuggestV2L1'));
      this.reporter.info(this.reporter.lang('plugnplaySuggestV2L2'));
    }

    let flattenedTopLevelPatterns = [];
    const steps = [];
    const {
      requests: depRequests,
      patterns: rawPatterns,
      ignorePatterns,
      workspaceLayout,
      manifest,
    } = await this.fetchRequestFromCwd();
    let topLevelPatterns = [];

    const artifacts = await this.integrityChecker.getArtifacts();
    if (artifacts) {
      this.linker.setArtifacts(artifacts);
      this.scripts.setArtifacts(artifacts);
    }

    shouldCheck(manifest, this.flags) &&
      steps.push((curr, total) => {
        this.reporter.step(curr, total, this.reporter.lang('checkingManifest'), emoji.get('mag'));
        return this.checkCompatibility().then(noop);
      });

    const audit = new Audit(this.config, this.reporter, {groups: OWNED_DEPENDENCY_TYPES});
    let auditFoundProblems = false;

    steps.push((curr, total) =>
      callThroughHook('resolveStep', async () => {
        this.reporter.step(curr, total, this.reporter.lang('resolvingPackages'), emoji.get('mag'));
        await this.resolver.init(this.prepareRequests(depRequests), {
          isFlat: this.flags.flat,
          isFrozen: this.flags.frozenLockfile,
          workspaceLayout,
        });
        topLevelPatterns = this.preparePatterns(rawPatterns);
        flattenedTopLevelPatterns = await this.flatten(topLevelPatterns);
        return {bailout: !this.flags.audit && (await this.bailout(topLevelPatterns, workspaceLayout))};
      })
    );

    this.flags.audit &&
      steps.push((curr, total) =>
        callThroughHook('auditStep', async () => {
          this.reporter.step(curr, total, this.reporter.lang('auditRunning'), emoji.get('mag'));
          if (this.flags.offline) {
            this.reporter.warn(this.reporter.lang('auditOffline'));
            return {bailout: false};
          }
          const preparedManifests = await this.prepareManifests(),
            mergedManifest = Object.assign({}, ...Object.values(preparedManifests).map(m => m.object));
          const auditVulnerabilityCounts = await audit.performAudit(
            mergedManifest,
            this.lockfile,
            this.resolver,
            this.linker,
            topLevelPatterns
          );
          auditFoundProblems =
            auditVulnerabilityCounts.info ||
            auditVulnerabilityCounts.low ||
            auditVulnerabilityCounts.moderate ||
            auditVulnerabilityCounts.high ||
            auditVulnerabilityCounts.critical;
          return {bailout: await this.bailout(topLevelPatterns, workspaceLayout)};
        })
      );

    steps.push((curr, total) =>
      callThroughHook('fetchStep', async () => {
        this.markIgnored(ignorePatterns);
        this.reporter.step(curr, total, this.reporter.lang('fetchingPackages'), emoji.get('truck'));
        const manifests = await fetch(this.resolver.getManifests(), this.config);
        this.resolver.updateManifests(manifests);
        await check(this.resolver.getManifests(), this.config, this.flags.ignoreEngines);
      })
    );

    steps.push((curr, total) =>
      callThroughHook('linkStep', async () => {
        await this.integrityChecker.removeIntegrityFile();
        this.reporter.step(curr, total, this.reporter.lang('linkingDependencies'), emoji.get('link'));
        flattenedTopLevelPatterns = this.preparePatternsForLinking(
          flattenedTopLevelPatterns,
          manifest,
          this.config.lockfileFolder === this.config.cwd
        );
        await this.linker.init(flattenedTopLevelPatterns, workspaceLayout, {
          linkDuplicates: this.flags.linkDuplicates,
          ignoreOptional: this.flags.ignoreOptional,
        });
      })
    );

    this.config.plugnplayEnabled &&
      steps.push((curr, total) =>
        callThroughHook('pnpStep', async () => {
          const pnpPath = `${this.config.lockfileFolder}/${PNP_FILENAME}`;

          const code = await generatePnpMap(this.config, flattenedTopLevelPatterns, {
            resolver: this.resolver,
            reporter: this.reporter,
            targetPath: pnpPath,
            workspaceLayout,
          });

          try {
            if ((await readFile(pnpPath)) === code) return;
          } catch (_error) {}

          await writeFile(pnpPath, code);
          await chmod(pnpPath, 0o755);
        })
      );

    steps.push((curr, total) =>
      callThroughHook('buildStep', async () => {
        this.reporter.step(
          curr,
          total,
          this.flags.force ? this.reporter.lang('rebuildingPackages') : this.reporter.lang('buildingFreshPackages'),
          emoji.get('hammer')
        );

        this.config.ignoreScripts
          ? this.reporter.warn(this.reporter.lang('ignoredScripts'))
          : await this.scripts.init(flattenedTopLevelPatterns);
      })
    );

    this.flags.har &&
      steps.push((curr, total) => {
        const filename = `yarn-install_${new Date().toISOString().replace(/:/g, '-')}.har`;
        this.reporter.step(
          curr,
          total,
          this.reporter.lang('savingHar', filename),
          emoji.get('black_circle_for_record')
        );
        return this.config.requestManager.saveHar(filename).then(noop);
      });

    if (await this.shouldClean())
      steps.push((curr, total) => {
        this.reporter.step(curr, total, this.reporter.lang('cleaningModules'), emoji.get('recycle'));
        return clean$2(this.config, this.reporter).then(noop);
      });

    let currentStep = 0;
    for (const step of steps) {
      const stepResult = await step(++currentStep, steps.length);
      if (stepResult && stepResult.bailout) {
        this.flags.audit && audit.summary();

        auditFoundProblems && this.reporter.warn(this.reporter.lang('auditRunAuditForDetails'));

        this.maybeOutputUpdate();
        return flattenedTopLevelPatterns;
      }
    }

    this.flags.audit && audit.summary();
    auditFoundProblems && this.reporter.warn(this.reporter.lang('auditRunAuditForDetails'));

    await this.saveLockfileAndIntegrity(topLevelPatterns, workspaceLayout);
    await this.persistChanges();
    this.maybeOutputUpdate();
    this.config.requestManager.clearCache();
    return flattenedTopLevelPatterns;
  }

  async checkCompatibility() {
    const {manifest} = await this.fetchRequestFromCwd();
    await checkOne(manifest, this.config, this.flags.ignoreEngines);
  }

  async persistChanges() {
    const manifests = await this.config.getRootManifests();

    if (await this.applyChanges(manifests)) await this.config.saveRootManifests(manifests);
  }

  applyChanges(manifests) {
    let hasChanged = false;

    if (this.config.plugnplayPersist) {
      const {object} = manifests.npm;

      if (typeof object.installConfig != 'object') object.installConfig = {};

      if (this.config.plugnplayEnabled && object.installConfig.pnp !== true) {
        object.installConfig.pnp = true;
        hasChanged = true;
      } else if (!this.config.plugnplayEnabled && object.installConfig.pnp !== void 0) {
        delete object.installConfig.pnp;
        hasChanged = true;
      }

      Object.keys(object.installConfig).length > 0 || delete object.installConfig;
    }

    return Promise.resolve(hasChanged);
  }

  shouldClean() {
    return exists(path.join(this.config.lockfileFolder, CLEAN_FILENAME));
  }

  async flatten(patterns) {
    if (!this.flags.flat) return patterns;

    const flattenedPatterns = [];

    for (const name of this.resolver.getAllDependencyNamesByLevelOrder(patterns)) {
      const infos = this.resolver.getAllInfoForPackageName(name).filter((manifest) => {
        const ref = manifest._reference;
        invariant(ref, 'expected package reference');
        return !ref.ignore;
      });

      if (infos.length === 0) continue;

      if (infos.length === 1) {
        flattenedPatterns.push(this.resolver.patternsByPackage[name][0]);
        continue;
      }

      const options = infos.map((info) => {
        const ref = info._reference;
        invariant(ref, 'expected reference');
        return {
          name: this.reporter.lang('manualVersionResolutionOption', ref.patterns.join(', '), info.version),

          value: info.version,
        };
      });
      const versions = infos.map((info) => info.version);
      let version;

      const resolutionVersion = this.resolutions[name];
      if (resolutionVersion && versions.indexOf(resolutionVersion) >= 0) version = resolutionVersion;
      else {
        version = await this.reporter.select(
          this.reporter.lang('manualVersionResolution', name),
          this.reporter.lang('answer'),
          options
        );
        this.resolutions[name] = version;
      }

      flattenedPatterns.push(this.resolver.collapseAllVersionsOfPackage(name, version));
    }

    if (Object.keys(this.resolutions).length) {
      const manifests = await this.config.getRootManifests();

      for (const name in this.resolutions) {
        const version = this.resolutions[name],

          patterns = this.resolver.patternsByPackage[name];
        if (!patterns) continue;

        let manifest;
        for (const pattern of patterns) {
          manifest = this.resolver.getResolvedPattern(pattern);
          if (manifest) break;
        }
        invariant(manifest, 'expected manifest');

        const ref = manifest._reference;
        invariant(ref, 'expected reference');

        const object = manifests[ref.registry].object;
        object.resolutions = object.resolutions || {};
        object.resolutions[name] = version;
      }

      await this.config.saveRootManifests(manifests);
    }

    return flattenedPatterns;
  }

  async pruneOfflineMirror(lockfile) {
    const mirror = this.config.getOfflineMirrorPath();
    if (!mirror) return;

    const requiredTarballs = new Set();
    for (const dependency in lockfile) {
      const resolved = lockfile[dependency].resolved;
      if (resolved) {
        const basename = path.basename(resolved.split('#')[0]);
        dependency[0] !== '@' || basename[0] === '@' || requiredTarballs.add(`${dependency.split('/')[0]}-${basename}`);

        requiredTarballs.add(basename);
      }
    }

    const mirrorFiles = await walk(mirror);
    for (const file of mirrorFiles) {
      const isTarball = path.extname(file.basename) === '.tgz',
        hasPrebuiltPackage = file.relative.startsWith('prebuilt/');
      !isTarball || hasPrebuiltPackage || requiredTarballs.has(file.basename) || (await unlink(file.absolute));
    }
  }

  async saveLockfileAndIntegrity(patterns, workspaceLayout) {
    const resolvedPatterns = {};
    Object.keys(this.resolver.patterns).forEach(pattern => {
      (workspaceLayout && workspaceLayout.getManifestByPattern(pattern)) ||
        (resolvedPatterns[pattern] = this.resolver.patterns[pattern]);
    });

    patterns = patterns.filter(p => !workspaceLayout || !workspaceLayout.getManifestByPattern(p));

    const lockfileBasedOnResolver = this.lockfile.getLockfile(resolvedPatterns);

    if (this.config.pruneOfflineMirror) await this.pruneOfflineMirror(lockfileBasedOnResolver);

    this.config.plugnplayEnabled ||
      (await this.integrityChecker.save(
        patterns,
        lockfileBasedOnResolver,
        this.flags,
        workspaceLayout,
        this.scripts.getArtifacts()
      ));

    if (this.flags.lockfile === false || this.flags.pureLockfile || this.flags.frozenLockfile) return;

    const lockFileHasAllPatterns = patterns.every(p => this.lockfile.getLocked(p)),
      lockfilePatternsMatch = Object.keys(this.lockfile.cache || {}).every(p => lockfileBasedOnResolver[p]);
    const resolverPatternsAreSameAsInLockfile = Object.keys(lockfileBasedOnResolver).every(pattern => {
      const manifest = this.lockfile.getLocked(pattern);
      return (
        manifest &&
        manifest.resolved === lockfileBasedOnResolver[pattern].resolved &&
        deepEqual(manifest.prebuiltVariants, lockfileBasedOnResolver[pattern].prebuiltVariants)
      );
    });
    const integrityPatternsAreSameAsInLockfile = Object.keys(lockfileBasedOnResolver).every(pattern => {
      const existingIntegrityInfo = lockfileBasedOnResolver[pattern].integrity;
      if (!existingIntegrityInfo) return true;

      const manifest = this.lockfile.getLocked(pattern);
      return !(!manifest || !manifest.integrity) && ssri.stringify(manifest.integrity) === existingIntegrityInfo;
    });

    if (
      !this.flags.force &&
      this.lockfile.parseResultType === 'success' &&
      lockFileHasAllPatterns &&
      lockfilePatternsMatch &&
      resolverPatternsAreSameAsInLockfile &&
      integrityPatternsAreSameAsInLockfile &&
      patterns.length
    )
      return;

    const loc = path.join(this.config.lockfileFolder, LOCKFILE_FILENAME),

      lockSource = Lockfile.stringify(lockfileBasedOnResolver, false, this.config.enableLockfileVersions);
    await writeFilePreservingEol(loc, lockSource);

    this._logSuccessSaveLockfile();
  }

  _logSuccessSaveLockfile() {
    this.reporter.success(this.reporter.lang('savedLockfile'));
  }

  async hydrate(ignoreUnusedPatterns) {
    const request = await this.fetchRequestFromCwd([], ignoreUnusedPatterns),
      {requests: depRequests, patterns: rawPatterns, ignorePatterns, workspaceLayout} = request;

    await this.resolver.init(depRequests, {
      isFlat: this.flags.flat,
      isFrozen: this.flags.frozenLockfile,
      workspaceLayout,
    });
    await this.flatten(rawPatterns);
    this.markIgnored(ignorePatterns);

    const manifests = await fetch(this.resolver.getManifests(), this.config);
    this.resolver.updateManifests(manifests);
    await check(this.resolver.getManifests(), this.config, this.flags.ignoreEngines);

    for (const manifest of this.resolver.getManifests()) {
      const ref = manifest._reference;
      invariant(ref, 'expected reference');
      const {type} = ref.remote;
      let loc = '';
      if (type === 'link') continue;
      if (type === 'workspace') {
        if (!ref.remote.reference) continue;

        loc = ref.remote.reference;
      } else loc = this.config.generateModuleCachePath(ref);

      const newPkg = await this.config.readManifest(loc);
      await this.resolver.updateManifest(ref, newPkg);
    }

    return request;
  }

  checkUpdate() {
    if (this.config.nonInteractive || this.config.getOption('disable-self-update-check')) return;

    const lastUpdateCheck = Number(this.config.getOption('lastUpdateCheck')) || 0;

    (lastUpdateCheck && Date.now() - lastUpdateCheck < ONE_DAY) || version.indexOf('-') >= 0 ||
      this._checkUpdate().catch(() => {});
  }

  async _checkUpdate() {
    let latestVersion = await this.config.requestManager.request({url: SELF_UPDATE_VERSION_URL});
    invariant(typeof latestVersion == 'string', 'expected string');
    latestVersion = latestVersion.trim();
    if (!semver.valid(latestVersion)) return;

    this.config.registries.yarn.saveHomeConfig({lastUpdateCheck: Date.now()});

    if (semver.gt(latestVersion, version)) {
      const installationMethod = await getInstallationMethod();
      this.maybeOutputUpdate = () => {
        this.reporter.warn(this.reporter.lang('yarnOutdated', latestVersion, version));

        const command = getUpdateCommand(installationMethod);
        if (command) {
          this.reporter.info(this.reporter.lang('yarnOutdatedCommand'));
          this.reporter.command(command);
        } else {
          const installer = getUpdateInstaller(installationMethod);
          installer && this.reporter.info(this.reporter.lang('yarnOutdatedInstaller', installer));
        }
      };
    }
  }

  maybeOutputUpdate() {}
}

function hasWrapper$6(commander, args) {
  return true;
}

function setFlags$6(commander) {
  commander.description('Yarn install is used to install all dependencies for a project.');
  commander.usage('install [flags]');
  commander.option('-A, --audit', 'Run vulnerability audit on installed packages');
  commander.option('-g, --global', 'DEPRECATED');
  commander.option('-S, --save', 'DEPRECATED - save package to your `dependencies`');
  commander.option('-D, --save-dev', 'DEPRECATED - save package to your `devDependencies`');
  commander.option('-P, --save-peer', 'DEPRECATED - save package to your `peerDependencies`');
  commander.option('-O, --save-optional', 'DEPRECATED - save package to your `optionalDependencies`');
  commander.option('-E, --save-exact', 'DEPRECATED');
  commander.option('-T, --save-tilde', 'DEPRECATED');
}

async function install(config, reporter, flags, lockfile) {
  await wrapLifecycle(config, flags, async () => {
    const install = new Install(flags, config, reporter, lockfile);
    await install.init();
  });
}

async function run$6(config, reporter, flags, args) {
  let lockfile,
    error = 'installCommandRenamed';
  lockfile = flags.lockfile === false ? new Lockfile() : await Lockfile.fromDirectory(config.lockfileFolder, reporter);

  if (args.length) {
    const exampleArgs = args.slice();

    flags.saveDev && exampleArgs.push('--dev');
    flags.savePeer && exampleArgs.push('--peer');
    flags.saveOptional && exampleArgs.push('--optional');
    flags.saveExact && exampleArgs.push('--exact');
    flags.saveTilde && exampleArgs.push('--tilde');

    let command = 'add';
    if (flags.global) {
      error = 'globalFlagRemoved';
      command = 'global add';
    }
    throw new MessageError(reporter.lang(error, `yarn ${command} ${exampleArgs.join(' ')}`));
  }

  await install(config, reporter, flags, lockfile);
}

async function wrapLifecycle(config, flags, factory) {
  await config.executeLifecycleScript('preinstall');

  await factory();

  await config.executeLifecycleScript('install');
  await config.executeLifecycleScript('postinstall');

  if (!config.production) {
    config.disablePrepublish || (await config.executeLifecycleScript('prepublish'));

    await config.executeLifecycleScript('prepare');
  }
}

var install$1 = {
  __proto__: null,
  Install,
  hasWrapper: hasWrapper$6,
  setFlags: setFlags$6,
  install,
  run: run$6,
  wrapLifecycle,
};

const requireLockfile$1 = true;

function buildCount(trees) {
  if (!trees || !trees.length) return 0;

  let count = 0;

  for (const tree of trees)
    if (!tree.shadow) {
      count++;
      count += buildCount(tree.children);
    }

  return count;
}

async function buildTree$1(resolver, linker, patterns, opts, onlyFresh, ignoreHoisted) {
  const treesByKey = {},
    trees = [],
    flatTree = await linker.getFlatHoistedTree(patterns),

    {workspaceLayout} = resolver;
  const hoisted =
    workspaceLayout && workspaceLayout.virtualManifestName
      ? flatTree.filter(([key]) => key.indexOf(workspaceLayout.virtualManifestName) < 0)
      : flatTree;

  const hoistedByKey = {};
  for (const [key, info] of hoisted) hoistedByKey[key] = info;

  for (const [, info] of hoisted) {
    const ref = info.pkg._reference,
      hint = null,
      parent = getParent$1(info.key, treesByKey),
      children = [];
    let depth = 0,
      color = 'bold';
    invariant(ref, 'expected reference');

    if (onlyFresh) {
      let isFresh = false;
      for (const pattern of ref.patterns)
        if (resolver.isNewPattern(pattern)) {
          isFresh = true;
          break;
        }

      if (!isFresh) continue;
    }

    if (info.originalKey !== info.key || opts.reqDepth === 0) color = null;

    depth = parent && parent.depth > 0 ? parent.depth + 1 : 0;

    const topLevel = opts.reqDepth === 0 && !parent,
      showAll = opts.reqDepth === -1,
      nextDepthIsValid = depth + 1 <= Number(opts.reqDepth);

    if (topLevel || nextDepthIsValid || showAll)
      treesByKey[info.key] = {name: `${info.pkg.name}@${info.pkg.version}`, children, hint, color, depth};

    const nextChildDepthIsValid = depth + 1 < Number(opts.reqDepth);
    invariant(ref, 'expected reference');
    if ((!ignoreHoisted && nextDepthIsValid) || showAll)
      for (const pattern of resolver.dedupePatterns(ref.dependencies)) {
        const pkg = resolver.getStrictResolvedPattern(pattern);

        hoistedByKey[`${info.key}#${pkg.name}`] || (!nextChildDepthIsValid && !showAll) ||
          children.push({name: pattern, color: 'dim', shadow: true});
      }
  }

  for (const [, info] of hoisted) {
    const tree = treesByKey[info.key],
      parent = getParent$1(info.key, treesByKey);

    if (tree) info.key.split('#').length === 1 ? trees.push(tree) : parent && parent.children.push(tree);
  }

  return {trees, count: buildCount(trees)};
}

function getParent$1(key, treesByKey) {
  return treesByKey[key.slice(0, key.lastIndexOf('#'))];
}

function hasWrapper$7(commander, args) {
  return true;
}

function setFlags$7(commander) {
  commander.description('Lists installed packages.');
  commander.option('--depth [depth]', 'Limit the depth of the shown dependencies');
  commander.option('--pattern [pattern]', 'Filter dependencies by pattern');
}

function getReqDepth(inputDepth) {
  return inputDepth && /^\d+$/.test(inputDepth) ? Number(inputDepth) : -1;
}

function filterTree(tree, filters, pattern = '') {
  if (tree.children) tree.children = tree.children.filter(child => filterTree(child, filters, pattern));

  const notDim = tree.color !== 'dim',
    hasChildren = tree.children != null && tree.children.length > 0,
    name = tree.name.slice(0, tree.name.lastIndexOf('@')),
    found = micromatch.any(name, filters) || micromatch.contains(name, pattern);

  return notDim && (found || hasChildren);
}

function getDevDeps(manifest) {
  return manifest.devDependencies
    ? new Set(Object.keys(manifest.devDependencies).map(key => `${key}@${manifest.devDependencies[key]}`))
    : new Set();
}

async function run$7(config, reporter, flags, args) {
  const lockfile = await Lockfile.fromDirectory(config.lockfileFolder, reporter),
    install = new Install(flags, config, reporter, lockfile),

    {requests: depRequests, patterns, manifest, workspaceLayout} = await install.fetchRequestFromCwd();
  await install.resolver.init(depRequests, {
    isFlat: install.flags.flat,
    isFrozen: install.flags.frozenLockfile,
    workspaceLayout,
  });

  let activePatterns = [];
  if (config.production) {
    const devDeps = getDevDeps(manifest);
    activePatterns = patterns.filter(pattern => !devDeps.has(pattern));
  } else activePatterns = patterns;

  const opts = {reqDepth: getReqDepth(flags.depth)};

  let {trees} = await buildTree$1(install.resolver, install.linker, activePatterns, opts);

  args.length && reporter.warn(reporter.lang('deprecatedListArgs'));

  if (args.length || flags.pattern) trees = trees.filter(tree => filterTree(tree, args, flags.pattern));

  reporter.tree('list', trees, {force: true});
}

var list$1 = {
  __proto__: null,
  requireLockfile: requireLockfile$1,
  buildTree: buildTree$1,
  getParent: getParent$1,
  hasWrapper: hasWrapper$7,
  setFlags: setFlags$7,
  getReqDepth,
  filterTree,
  getDevDeps,
  run: run$7,
};

const SILENCE_DEPENDENCY_TYPE_WARNINGS = ['upgrade', 'upgrade-interactive'];

class Add extends Install {
  constructor(args, flags, config, reporter, lockfile) {
    const workspaceRootIsCwd = config.cwd === config.lockfileFolder;
    super(flags ? {...flags, workspaceRootIsCwd} : {workspaceRootIsCwd}, config, reporter, lockfile);
    this.args = args;
    this.flagToOrigin = [
      flags.dev && 'devDependencies',
      flags.optional && 'optionalDependencies',
      flags.peer && 'peerDependencies',
      'dependencies',
    ]
      .filter(Boolean)
      .shift();
  }

  prepareRequests(requests) {
    const requestsWithArgs = requests.slice();

    for (const pattern of this.args) requestsWithArgs.push({pattern, registry: 'npm', optional: false});

    return requestsWithArgs;
  }

  getPatternVersion(pattern, pkg) {
    const tilde = this.flags.tilde,
      configPrefix = String(this.config.getOption('save-prefix')),
      exact = this.flags.exact || Boolean(this.config.getOption('save-exact')) || configPrefix === '',
      {hasVersion, range} = normalizePattern(pattern);
    let version;

    if (getExoticResolver(pattern)) version = pattern;
    else if (hasVersion && range && (semver.satisfies(pkg.version, range) || getExoticResolver(range))) version = range;

    if (!version || semver.valid(version)) {
      let prefix = configPrefix || '^';

      if (tilde) prefix = '~';
      else if (version || exact) prefix = '';

      version = `${prefix}${pkg.version}`;
    }

    return version;
  }

  preparePatterns(patterns) {
    const preparedPatterns = patterns.slice();
    for (const pattern of this.resolver.dedupePatterns(this.args)) {
      const pkg = this.resolver.getResolvedPattern(pattern);
      invariant(pkg, 'missing package ' + pattern);
      const version = this.getPatternVersion(pattern, pkg),
        newPattern = `${pkg.name}@${version}`;
      preparedPatterns.push(newPattern);
      this.addedPatterns.push(newPattern);

      newPattern === pattern || this.resolver.replacePattern(pattern, newPattern);
    }
    return preparedPatterns;
  }

  preparePatternsForLinking(patterns, cwdManifest, cwdIsRoot) {
    if (cwdIsRoot) return patterns;

    let manifest;
    const cwdPackage = `${cwdManifest.name}@${cwdManifest.version}`;
    try {
      manifest = this.resolver.getStrictResolvedPattern(cwdPackage);
    } catch (_e) {
      this.reporter.warn(this.reporter.lang('unknownPackage', cwdPackage));
      return patterns;
    }

    let newPatterns = patterns;
    this._iterateAddedPackages((pattern, registry, dependencyType, pkgName, version) => {
      const filtered = newPatterns.filter(p => p !== pattern);
      invariant(
        newPatterns.length - filtered.length > 0,
        `expect added pattern '${pattern}' in the list: ${patterns.toString()}`
      );
      newPatterns = filtered;

      manifest[dependencyType] = manifest[dependencyType] || {};
      if (manifest[dependencyType][pkgName] === version) return;

      invariant(manifest._reference, 'manifest._reference should not be null');
      const ref = manifest._reference;

      ref.dependencies = ref.dependencies || [];
      ref.dependencies.push(pattern);
    });

    return newPatterns;
  }

  async bailout(patterns, workspaceLayout) {
    const lockfileCache = this.lockfile.cache;
    if (!lockfileCache) return false;

    const match = await this.integrityChecker.check(patterns, lockfileCache, this.flags, workspaceLayout),
      haveLockfile = await exists(path.join(this.config.lockfileFolder, LOCKFILE_FILENAME));
    match.integrityFileMissing && haveLockfile && this.scripts.setForce(true);

    return false;
  }

  async init() {
    if (
      this.config.workspaceRootFolder &&
      this.config.cwd === this.config.workspaceRootFolder &&
      !this.flags.ignoreWorkspaceRootCheck
    )
      throw new MessageError(this.reporter.lang('workspacesAddRootCheck'));

    this.addedPatterns = [];
    const patterns = await Install.prototype.init.call(this);
    await this.maybeOutputSaveTree(patterns);
    return patterns;
  }

  async applyChanges(manifests) {
    await Install.prototype.applyChanges.call(this, manifests);

    await Install.prototype.fetchRequestFromCwd.call(this);

    this._iterateAddedPackages((pattern, registry, dependencyType, pkgName, version) => {
      const {object} = manifests[registry];

      object[dependencyType] = object[dependencyType] || {};
      object[dependencyType][pkgName] = version;

      SILENCE_DEPENDENCY_TYPE_WARNINGS.indexOf(this.config.commandName) < 0 &&
        dependencyType !== this.flagToOrigin &&
        this.reporter.warn(this.reporter.lang('moduleAlreadyInManifest', pkgName, dependencyType, this.flagToOrigin));
    });

    return true;
  }

  fetchRequestFromCwd() {
    return Install.prototype.fetchRequestFromCwd.call(this, this.args);
  }

  async maybeOutputSaveTree(patterns) {
    const opts = {reqDepth: 0},

      merged = [...patterns, ...this.addedPatterns],

      {trees, count} = await buildTree$1(this.resolver, this.linker, merged, opts, true, true);

    count === 1
      ? this.reporter.success(this.reporter.lang('savedNewDependency'))
      : this.reporter.success(this.reporter.lang('savedNewDependencies', count));

    if (!count) return;

    const resolverPatterns = new Set();
    for (const pattern of patterns) {
      const {version, name} = this.resolver.getResolvedPattern(pattern) || {};
      resolverPatterns.add(`${name}@${version}`);
    }
    const directRequireDependencies = trees.filter(({name}) => resolverPatterns.has(name));

    this.reporter.info(this.reporter.lang('directDependencies'));
    this.reporter.tree('newDirectDependencies', directRequireDependencies);
    this.reporter.info(this.reporter.lang('allDependencies'));
    this.reporter.tree('newAllDependencies', trees);
  }

  savePackages() {
    return Promise.resolve(); // empty async method
  }

  _iterateAddedPackages(f) {
    const patternOrigins = Object.keys(this.rootPatternsToOrigin);

    for (const pattern of this.addedPatterns) {
      const pkg = this.resolver.getResolvedPattern(pattern);
      invariant(pkg, 'missing package ' + pattern);
      const version = this.getPatternVersion(pattern, pkg),
        ref = pkg._reference;
      invariant(ref, 'expected package reference');

      const target =
        patternOrigins.reduce(
          (acc, prev) => (prev.indexOf(pkg.name + '@') === 0 ? this.rootPatternsToOrigin[prev] : acc),
          null
        ) || this.flagToOrigin;

      f(pattern, ref.registry, target, pkg.name, version);
    }
  }
}

function hasWrapper$8(commander) {
  return true;
}

function setFlags$8(commander) {
  commander.description('Installs a package and any packages that it depends on.');
  commander.usage('add [packages ...] [flags]');
  commander.option('-W, --ignore-workspace-root-check', 'required to run yarn add inside a workspace root');
  commander.option('-D, --dev', 'save package to your `devDependencies`');
  commander.option('-P, --peer', 'save package to your `peerDependencies`');
  commander.option('-O, --optional', 'save package to your `optionalDependencies`');
  commander.option('-E, --exact', 'install exact version');
  commander.option('-T, --tilde', 'install most recent release with the same minor version');
  commander.option('-A, --audit', 'Run vulnerability audit on installed packages');
}

async function run$8(config, reporter, flags, args) {
  if (!args.length) throw new MessageError(reporter.lang('missingAddDependencies'));

  const lockfile = await Lockfile.fromDirectory(config.lockfileFolder, reporter);

  await wrapLifecycle(config, flags, () => {
    const install = new Add(args, flags, config, reporter, lockfile);
    return install.init().then(noop);
  });
}

var add = {
  __proto__: null,
  Add,
  hasWrapper: hasWrapper$8,
  setFlags: setFlags$8,
  run: run$8,
};

function toObject(input) {
  const output = Object.create(null);

  for (const [key, val] of input.entries()) output[key] = val;

  return output;
}

async function getBinEntries(config) {
  const binFolders = new Set(),
    binEntries = new Map();

  for (const registryFolder of config.registryFolders) {
    binFolders.add(path.resolve(config.cwd, registryFolder, '.bin'));
    binFolders.add(path.resolve(config.lockfileFolder, registryFolder, '.bin'));
  }

  if (await exists(`${config.lockfileFolder}/${PNP_FILENAME}`)) {
    const pnpApi = dynamicRequire(`${config.lockfileFolder}/${PNP_FILENAME}`),

      packageLocator = pnpApi.findPackageLocator(config.cwd + '/'),
      packageInformation = pnpApi.getPackageInformation(packageLocator);

    for (const [name, reference] of packageInformation.packageDependencies.entries()) {
      const dependencyInformation = pnpApi.getPackageInformation({name, reference});

      dependencyInformation.packageLocation && binFolders.add(dependencyInformation.packageLocation + '/.bin');
    }
  }

  for (const binFolder of binFolders)
    if (await exists(binFolder))
      for (const name of await readdir(binFolder)) binEntries.set(name, path.join(binFolder, name));

  return binEntries;
}

function setFlags$9(commander) {
  commander.description('Runs a defined package script.');
}

function hasWrapper$9(commander, args) {
  return true;
}

async function run$9(config, reporter, flags, args) {
  const pkg = await config.readManifest(config.cwd),

    binCommands = new Set(),
    pkgCommands = new Set(),

    scripts = new Map();

  for (const [name, loc] of await getBinEntries(config)) {
    scripts.set(name, puka.quoteForShell(loc));
    binCommands.add(name);
  }

  const pkgScripts = pkg.scripts;

  if (pkgScripts)
    for (const name of Object.keys(pkgScripts).sort()) {
      scripts.set(name, pkgScripts[name] || '');
      pkgCommands.add(name);
    }

  function runCommand([action, ...args]) {
    return callThroughHook('runScript', () => realRunCommand(action, args), {action, args});
  }

  async function realRunCommand(action, args) {
    const cmds = [];

    if (pkgScripts && action in pkgScripts) {
      const preAction = 'pre' + action;
      preAction in pkgScripts && cmds.push([preAction, pkgScripts[preAction]]);

      const script = scripts.get(action);
      invariant(script, 'Script must exist');
      cmds.push([action, script]);

      const postAction = 'post' + action;
      postAction in pkgScripts && cmds.push([postAction, pkgScripts[postAction]]);
    } else if (scripts.has(action)) {
      const script = scripts.get(action);
      invariant(script, 'Script must exist');
      cmds.push([action, script]);
    }

    if (cmds.length) {
      const ignoreEngines = !(!flags.ignoreEngines && !config.getOption('ignore-engines'));
      try {
        await checkOne(pkg, config, ignoreEngines);
      } catch (err) {
        throw err instanceof MessageError ? new MessageError(reporter.lang('cannotRunWithIncompatibleEnv')) : err;
      }

      process.env.YARN_WRAP_OUTPUT = 'false';
      for (const [stage, cmd] of cmds) {
        const cmdWithArgs = stage === action ? puka.sh`${puka.unquoted(cmd)} ${args}` : cmd,
          customShell = config.getOption('script-shell');
        await execCommand({
          stage,
          config,
          cmd: cmdWithArgs,
          cwd: flags.into || config.cwd,
          isInteractive: true,
          customShell: customShell ? String(customShell) : void 0,
        });
      }
    } else if (action === 'env')
      reporter.log(JSON.stringify(await makeEnv('env', config.cwd, config), null, 2), {force: true});
    else {
      let suggestion;

      for (const commandName of scripts.keys()) if (leven(commandName, action) < 2) suggestion = commandName;

      let msg = `Command ${JSON.stringify(action)} not found.`;
      if (suggestion) msg += ` Did you mean ${JSON.stringify(suggestion)}?`;

      throw new MessageError(msg);
    }
  }

  if (args.length === 0) {
    binCommands.size > 0
      ? reporter.info('' + reporter.lang('binCommands') + Array.from(binCommands).join(', '))
      : reporter.error(reporter.lang('noBinAvailable'));

    const printedCommands = new Map();

    for (const pkgCommand of pkgCommands) {
      const action = scripts.get(pkgCommand);
      invariant(action, 'Action must exists');
      printedCommands.set(pkgCommand, action);
    }

    if (pkgCommands.size > 0) {
      reporter.info('' + reporter.lang('possibleCommands'));
      reporter.list('possibleCommands', Array.from(pkgCommands), toObject(printedCommands));
      flags.nonInteractive ||
        (await reporter.question(reporter.lang('commandQuestion')).then(
          answer => runCommand(answer.trim().split(' ')),
          () => reporter.error(reporter.lang('commandNotSpecified'))
        ));
    } else reporter.error(reporter.lang('noScriptsAvailable'));

    return Promise.resolve(); //
  }
  return runCommand(args);
}

var run$a = {
  __proto__: null,
  getBinEntries,
  setFlags: setFlags$9,
  hasWrapper: hasWrapper$9,
  run: run$9,
};

function hasWrapper$a(commander) {
  return false;
}

function setFlags$a(commander) {
  commander.description('Displays the location of the yarn bin folder.');
}

async function run$b(config, reporter, flags, args) {
  const binFolder = path.join(config.cwd, config.registryFolders[0], '.bin');
  if (args.length === 0) reporter.log(binFolder, {force: true});
  else {
    const binEntries = await getBinEntries(config),

      binName = args[0],
      binPath = binEntries.get(binName);

    binPath ? reporter.log(binPath, {force: true}) : reporter.error(reporter.lang('packageBinaryNotFound', binName));
  }
}

var bin = {
  __proto__: null,
  hasWrapper: hasWrapper$a,
  setFlags: setFlags$a,
  run: run$b,
};

const requireLockfile$2 = false,
  noArguments$1 = true;

function hasWrapper$b(commander) {
  return true;
}

function setFlags$b(commander) {
  commander.description('Verifies if versions in the current project’s package.json match that of yarn’s lock file.');
  commander.option('--integrity');
  commander.option('--verify-tree');
}

async function verifyTreeCheck(config, reporter, flags, args) {
  let errCount = 0;
  function reportError(msg, ...vars) {
    reporter.error(reporter.lang(msg, ...vars));
    errCount++;
  }
  const registryName = 'yarn',
    registryFolder = config.registryFolders[0],
    cwd = config.workspaceRootFolder ? config.lockfileFolder : config.cwd,
    rootManifest = await config.readManifest(cwd, registryName),

    dependenciesToCheckVersion = [];
  if (rootManifest.dependencies)
    for (const name in rootManifest.dependencies) {
      const version = rootManifest.dependencies[name];

      /^link:/i.test(version) || (/^file:/i.test(version) && config.linkFileDependencies) ||
        dependenciesToCheckVersion.push({name, originalKey: name, parentCwd: cwd, version});
    }

  if (rootManifest.devDependencies && !config.production)
    for (const name in rootManifest.devDependencies) {
      const version = rootManifest.devDependencies[name];

      /^link:/i.test(version) || (/^file:/i.test(version) && config.linkFileDependencies) ||
        dependenciesToCheckVersion.push({name, originalKey: name, parentCwd: cwd, version});
    }

  for (const locationsVisited = new Set(); dependenciesToCheckVersion.length; ) {
    const dep = dependenciesToCheckVersion.shift(),
      manifestLoc = path.resolve(dep.parentCwd, registryFolder, dep.name);
    if (locationsVisited.has(manifestLoc + '@' + dep.version)) continue;

    locationsVisited.add(manifestLoc + '@' + dep.version);
    if (config.plugnplayEnabled) continue;

    if (!(await exists(manifestLoc))) {
      reportError('packageNotInstalled', '' + dep.originalKey);
      continue;
    }
    if (!(await exists(path.join(manifestLoc, 'package.json')))) continue;

    const pkg = await config.readManifest(manifestLoc, registryName);
    if (
      semver.validRange(dep.version, config.looseSemver) &&
      !semver.satisfies(pkg.version, dep.version, config.looseSemver)
    ) {
      reportError('packageWrongVersion', dep.originalKey, dep.version, pkg.version);
      continue;
    }
    const dependencies = pkg.dependencies;
    if (dependencies)
      for (const subdep in dependencies) {
        const subDepPath = path.resolve(manifestLoc, registryFolder, subdep);
        let found = false;
        const relative = path.relative(cwd, subDepPath),
          locations = path.normalize(relative).split(registryFolder + path.sep).filter(dir => !!dir);
        locations.pop();
        while (locations.length >= 0) {
          let possiblePath =
            locations.length > 0
              ? path.join(cwd, registryFolder, locations.join(path.sep + registryFolder + path.sep))
              : cwd;

          if (await exists(path.resolve(possiblePath, registryFolder, subdep))) {
            dependenciesToCheckVersion.push({
              name: subdep,
              originalKey: `${dep.originalKey}#${subdep}`,
              parentCwd: possiblePath,
              version: dependencies[subdep],
            });
            found = true;
            break;
          }
          if (!locations.length) break;

          locations.pop();
        }
        found || reportError('packageNotInstalled', `${dep.originalKey}#${subdep}`);
      }
  }

  if (errCount > 0) throw new MessageError(reporter.lang('foundErrors', errCount));

  reporter.success(reporter.lang('folderInSync'));
}

async function integrityHashCheck(config, reporter, flags, args) {
  let errCount = 0;
  function reportError(msg, ...vars) {
    reporter.error(reporter.lang(msg, ...vars));
    errCount++;
  }
  const integrityChecker = new InstallationIntegrityChecker(config),

    lockfile = await Lockfile.fromDirectory(config.cwd),
    install = new Install(flags, config, reporter, lockfile),

    {patterns, workspaceLayout} = await install.fetchRequestFromCwd(),

    match = await integrityChecker.check(patterns, lockfile.cache, flags, workspaceLayout);
  for (const pattern of match.missingPatterns) reportError('lockfileNotContainPattern', pattern);

  match.integrityFileMissing && reportError('noIntegrityFile');

  if (match.integrityMatches === false) {
    reporter.warn(reporter.lang(integrityErrors[match.integrityError]));
    reportError('integrityCheckFailed');
  }

  if (errCount > 0) throw new MessageError(reporter.lang('foundErrors', errCount));

  reporter.success(reporter.lang('folderInSync'));
}

async function run$c(config, reporter, flags, args) {
  if (flags.verifyTree) {
    await verifyTreeCheck(config, reporter);
    return;
  }
  if (flags.integrity) {
    await integrityHashCheck(config, reporter, flags);
    return;
  }

  const lockfile = await Lockfile.fromDirectory(config.cwd),
    install = new Install(flags, config, reporter, lockfile);

  function humaniseLocation(loc) {
    const relative = path.relative(path.join(config.cwd, 'node_modules'), loc),
      normalized = path.normalize(relative).split(path.sep);
    return normalized.filter(p => p !== 'node_modules').reduce((result, part) => {
      const length = result.length;
      length && result[length - 1].startsWith('@') && result[length - 1].indexOf(path.sep) < 0
        ? (result[length - 1] += path.sep + part)
        : result.push(part);

      return result;
    }, []);
  }

  let warningCount = 0,
    errCount = 0;
  function reportError(msg, ...vars) {
    reporter.error(reporter.lang(msg, ...vars));
    errCount++;
  }

  const {patterns: rawPatterns, workspaceLayout} = await install.hydrate(),
    patterns = await install.flatten(rawPatterns);

  for (const pattern of patterns)
    lockfile.getLocked(pattern) || (workspaceLayout && workspaceLayout.getManifestByPattern(pattern)) ||
      reportError('lockfileNotContainPattern', pattern);

  const bundledDeps = {},
    res = await install.linker.getFlatHoistedTree(patterns, workspaceLayout);
  for (const [loc, {originalKey, pkg, ignore}] of res) {
    if (ignore) continue;

    const parts = humaniseLocation(loc);

    let human = originalKey;
    const hoistedParts = parts.slice();
    if (human !== parts.join('#')) {
      const humanParts = human.split('#');

      for (let i = 0; i < humanParts.length; i++) {
        const humanPart = humanParts[i];

        if (hoistedParts[0] === humanPart) {
          hoistedParts.shift();

          if (i < humanParts.length - 1) humanParts[i] += '#';
        } else humanParts[i] = reporter.format.dim(humanPart + '#');
      }

      human = humanParts.join('');
    }

    const remoteType = pkg._reference.remote.type,
      isLinkedDependency =
        remoteType === 'link' || remoteType === 'workspace' || (remoteType === 'file' && config.linkFileDependencies),
      isResolution = pkg._reference.hint === 'resolution';
    if (isLinkedDependency || isResolution) continue;

    if (!(await exists(loc))) {
      pkg._reference.optional
        ? reporter.warn(reporter.lang('optionalDepNotInstalled', human))
        : reportError('packageNotInstalled', human);

      continue;
    }

    const pkgLoc = path.join(loc, 'package.json');

    if (await exists(pkgLoc)) {
      const packageJson = await config.readJson(pkgLoc);
      packageJson.version = semver.clean(packageJson.version);

      pkg.version === packageJson.version ||
        reportError('packageWrongVersion', human, pkg.version, packageJson.version);

      const deps = Object.assign({}, packageJson.dependencies, packageJson.peerDependencies);
      bundledDeps[packageJson.name] = packageJson.bundledDependencies || [];

      for (const name in deps) {
        const range = deps[name];
        if (!semver.validRange(range, config.looseSemver)) continue;

        const subHuman = `${human}#${name}@${range}`,

          possibles = [];
        let depLoc;
        for (let i = parts.length; i >= 0; i--) {
          const myParts = parts.slice(0, i).concat(name),

            myDepPkgLoc = path.join(config.cwd, 'node_modules', myParts.join(`${path.sep}node_modules${path.sep}`));

          possibles.push(myDepPkgLoc);
        }
        while (possibles.length) {
          const myDepPkgLoc = possibles.shift();
          if (await exists(myDepPkgLoc)) {
            depLoc = myDepPkgLoc;
            break;
          }
        }
        if (!depLoc) continue;

        const depPkgLoc = path.join(depLoc, 'package.json');

        if (await exists(depPkgLoc)) {
          const depPkg = await config.readJson(depPkgLoc),
            foundHuman = `${humaniseLocation(path.dirname(depPkgLoc)).join('#')}@${depPkg.version}`;
          if (!semver.satisfies(depPkg.version, range, config.looseSemver)) {
            const resPattern = install.resolutionMap.find(name, originalKey.split('#'));
            if (resPattern) {
              const resHuman = `${human}#${resPattern}`,
                {range: resRange} = normalizePattern(resPattern);

              if (semver.satisfies(depPkg.version, resRange, config.looseSemver)) {
                reporter.warn(reporter.lang('incompatibleResolutionVersion', foundHuman, subHuman));
                warningCount++;
              } else reportError('packageDontSatisfy', resHuman, foundHuman);
            } else reportError('packageDontSatisfy', subHuman, foundHuman);

            continue;
          }

          for (const loc of possibles) {
            const locPkg = path.join(loc, 'package.json');

            if (!(await exists(locPkg))) continue;

            const packageJson = await config.readJson(locPkg),
              packagePath = originalKey.split('#'),
              rootDep = packagePath[0],
              packageName = packagePath[1] || packageJson.name;

            if (
              (!bundledDeps[rootDep] || bundledDeps[rootDep].indexOf(packageName) < 0) &&
              (packageJson.version === depPkg.version ||
                (semver.satisfies(packageJson.version, range, config.looseSemver) &&
                  semver.gt(packageJson.version, depPkg.version, config.looseSemver)))
            ) {
              reporter.warn(
                reporter.lang(
                  'couldBeDeduped',
                  subHuman,
                  packageJson.version,
                  `${humaniseLocation(path.dirname(locPkg)).join('#')}@${packageJson.version}`
                )
              );
              warningCount++;
            }
            break;
          }
        }
      }
    }
  }

  warningCount > 1 && reporter.info(reporter.lang('foundWarnings', warningCount));

  if (errCount > 0) throw new MessageError(reporter.lang('foundErrors', errCount));

  reporter.success(reporter.lang('folderInSync'));
}

var check$1 = {
  __proto__: null,
  requireLockfile: requireLockfile$2,
  noArguments: noArguments$1,
  hasWrapper: hasWrapper$b,
  setFlags: setFlags$b,
  verifyTreeCheck,
  run: run$c,
};

const CONFIG_KEYS = [
  'registryFolders',
  'linkedModules',
  'cache',
  'cwd',
  'looseSemver',
  'commandName',
  'preferOffline',
  'modulesFolder',
  'globalFolder',
  'linkFolder',
  'offline',
  'binLinks',
  'ignorePlatform',
  'ignoreScripts',
  'disablePrepublish',
  'nonInteractive',
  'workspaceRootFolder',
  'lockfileFolder',
  'networkConcurrency',
  'childConcurrency',
  'networkTimeout',
  'workspacesEnabled',
  'workspacesNohoistEnabled',
  'pruneOfflineMirror',
  'enableMetaFolder',
  'enableLockfileVersions',
  'linkFileDependencies',
  'cacheFolder',
  'tempFolder',
  'production',
  'packageDateLimit',
  'disableWrappersFolder',
];

function hasWrapper$c(flags, args) {
  return args[0] !== 'get';
}

function setFlags$c(commander) {
  commander.description('Manages the yarn configuration files.');
}

const {run: run$d, examples: examples$2} = buildSubCommands('config', {
  async set(config, reporter, flags, args) {
    if (args.length === 0 || args.length > 2) return false;

    const [key, val = true] = args,
      yarnConfig = config.registries.yarn;
    await yarnConfig.saveHomeConfig({[key]: val});
    reporter.success(reporter.lang('configSet', key, val));
    return true;
  },

  get(config, reporter, flags, args) {
    if (args.length !== 1) return false;

    reporter.log(String(config.getOption(args[0])), {force: true});
    return true;
  },

  delete: async function(config, reporter, flags, args) {
    if (args.length !== 1) return false;

    const key = args[0],
      yarnConfig = config.registries.yarn;
    await yarnConfig.saveHomeConfig({[key]: void 0});
    reporter.success(reporter.lang('configDelete', key));
    return true;
  },

  list(config, reporter, flags, args) {
    if (args.length) return false;

    reporter.info(reporter.lang('configYarn'));
    reporter.inspect(config.registries.yarn.config);

    reporter.info(reporter.lang('configNpm'));
    reporter.inspect(config.registries.npm.config);

    return true;
  },

  current(config, reporter, flags, args) {
    if (args.length) return false;

    reporter.log(JSON.stringify(config, CONFIG_KEYS, 2), {force: true});

    return true;
  },
});

var config = {
  __proto__: null,
  hasWrapper: hasWrapper$c,
  setFlags: setFlags$c,
  run: run$d,
  examples: examples$2,
};

const requireLockfile$3 = true;

function setFlags$d(commander) {
  commander.description('Removes a package from your direct dependencies updating your package.json and yarn.lock.');
  commander.usage('remove [packages ...] [flags]');
  commander.option('-W, --ignore-workspace-root-check', 'required to run yarn remove inside a workspace root');
}

function hasWrapper$d(commander, args) {
  return true;
}

async function run$e(config, reporter, flags, args) {
  const isWorkspaceRoot = config.workspaceRootFolder && config.cwd === config.workspaceRootFolder;

  if (!args.length) throw new MessageError(reporter.lang('tooFewArguments', 1));

  if (isWorkspaceRoot && !flags.ignoreWorkspaceRootCheck)
    throw new MessageError(reporter.lang('workspacesRemoveRootCheck'));

  const totalSteps = args.length + 1;
  let step = 0;

  const lockfile = await Lockfile.fromDirectory(config.lockfileFolder),
    rootManifests = await config.getRootManifests(),
    manifests = [];

  for (const name of args) {
    reporter.step(++step, totalSteps, 'Removing module ' + name, emoji.get('wastebasket'));

    let found = false;

    for (const registryName of Object.keys(registries)) {
      const registry = config.registries[registryName],
        object = rootManifests[registryName].object;

      for (const type of DEPENDENCY_TYPES) {
        const deps = object[type];
        if (deps && deps[name]) {
          found = true;
          delete deps[name];
        }
      }

      const possibleManifestLoc = path.join(config.cwd, registry.folder, name);
      if (await exists(possibleManifestLoc)) {
        const manifest = await config.maybeReadManifest(possibleManifestLoc, registryName);
        manifest && manifests.push([possibleManifestLoc, manifest]);
      }
    }

    if (!found) throw new MessageError(reporter.lang('moduleNotInManifest'));
  }

  await config.saveRootManifests(rootManifests);

  for (const action of ['preuninstall', 'uninstall', 'postuninstall'])
    for (const [loc] of manifests) await config.executeLifecycleScript(action, loc);

  reporter.step(++step, totalSteps, reporter.lang('uninstallRegenerate'), emoji.get('hammer'));
  const installFlags = {force: true, workspaceRootIsCwd: true, ...flags},
    reinstall = new Install(installFlags, config, new NoopReporter(), lockfile);
  await reinstall.init();

  reporter.success(reporter.lang('uninstalledPackages'));
}

var remove = {
  __proto__: null,
  requireLockfile: requireLockfile$3,
  setFlags: setFlags$d,
  hasWrapper: hasWrapper$d,
  run: run$e,
};

const basicSemverOperatorRegex = new RegExp('^(\\^|~|>=|<=)?[^ |&,]+$'),

  validScopeRegex = /^@[a-zA-Z0-9-][a-zA-Z0-9_.-]*\/$/;

function setUserRequestedPackageVersions(deps, args, latest, packagePatterns, reporter) {
  args.forEach(requestedPattern => {
    let found = false,
      normalized = normalizePattern(requestedPattern);

    normalized.hasVersion || latest ||
      packagePatterns.forEach(packagePattern => {
        const packageNormalized = normalizePattern(packagePattern.pattern);
        if (packageNormalized.name === normalized.name) normalized = packageNormalized;
      });

    const newPattern = `${normalized.name}@${normalized.range}`;

    deps.forEach(dep => {
      if (normalized.hasVersion && dep.name === normalized.name) {
        found = true;
        dep.upgradeTo = newPattern;
        reporter.verbose(reporter.lang('verboseUpgradeBecauseRequested', requestedPattern, newPattern));
      }
    });

    if (normalized.hasVersion && !found) {
      deps.push({
        name: normalized.name,
        wanted: '',
        latest: '',
        url: '',
        hint: '',
        range: '',
        current: '',
        upgradeTo: newPattern,
        workspaceName: '',
        workspaceLoc: '',
      });
      reporter.verbose(reporter.lang('verboseUpgradeBecauseRequested', requestedPattern, newPattern));
    }
  });
}

function getRangeOperator(version) {
  const result = basicSemverOperatorRegex.exec(version);
  return result ? result[1] || '' : '^';
}

function buildPatternToUpgradeTo(dep, flags) {
  if (dep.latest === 'exotic') return `${dep.name}@${dep.url}`;

  const toLatest = flags.latest,
    toVersion = toLatest ? dep.latest : dep.range;
  let rangeOperator = '';

  if (toLatest)
    rangeOperator = flags.caret ? '^' : flags.tilde ? '~' : flags.exact ? '' : getRangeOperator(dep.range);

  return `${dep.name}@${rangeOperator}${toVersion}`;
}

function scopeFilter(flags, dep) {
  return !validScopeRegex.test(flags.scope) || dep.name.startsWith(flags.scope);
}

function cleanLockfile(lockfile, deps, packagePatterns, reporter) {
  function cleanDepFromLockfile(pattern, depth) {
    const lockManifest = lockfile.getLocked(pattern);
    if (!lockManifest || (depth > 1 && packagePatterns.some(packagePattern => packagePattern.pattern === pattern))) {
      reporter.verbose(reporter.lang('verboseUpgradeNotUnlocking', pattern));
      return;
    }

    const dependencies = Object.assign({}, lockManifest.dependencies || {}, lockManifest.optionalDependencies || {}),
      depPatterns = Object.keys(dependencies).map(key => `${key}@${dependencies[key]}`);
    reporter.verbose(reporter.lang('verboseUpgradeUnlocking', pattern));
    lockfile.removePattern(pattern);
    depPatterns.forEach(pattern => cleanDepFromLockfile(pattern, depth + 1));
  }

  deps.map(dep => dep.upgradeTo).forEach(pattern => cleanDepFromLockfile(pattern, 1));
}

function setFlags$e(commander) {
  commander.description('Upgrades packages to their latest version based on the specified range.');
  commander.usage('upgrade [flags]');
  commander.option('-S, --scope <scope>', 'upgrade packages under the specified scope');
  commander.option('-L, --latest', 'list the latest version of packages, ignoring version ranges in package.json');
  commander.option('-E, --exact', 'install exact version. Only used when --latest is specified.');
  commander.option('-P, --pattern [pattern]', 'upgrade packages that match pattern');
  commander.option(
    '-T, --tilde',
    'install most recent release with the same minor version. Only used when --latest is specified.'
  );
  commander.option(
    '-C, --caret',
    'install most recent release with the same major version. Only used when --latest is specified.'
  );
  commander.option('-A, --audit', 'Run vulnerability audit on installed packages');
}

function hasWrapper$e(commander, args) {
  return true;
}

const requireLockfile$4 = true;

async function run$f(config, reporter, flags, args) {
  let addArgs = [];
  const upgradeAll = args.length === 0 && flags.scope === void 0 && flags.pattern === void 0;
  const addFlags = Object.assign({}, flags, {
    force: true,
    ignoreWorkspaceRootCheck: true,
    workspaceRootIsCwd: config.cwd === config.lockfileFolder,
  });
  const lockfile = await Lockfile.fromDirectory(config.lockfileFolder, reporter),
    deps = await getOutdated(config, reporter, flags, lockfile, args),
    install = new Install(flags, config, reporter, lockfile),
    {requests: packagePatterns} = await install.fetchRequestFromCwd();

  setUserRequestedPackageVersions(deps, args, flags.latest, packagePatterns, reporter);
  cleanLockfile(lockfile, deps, packagePatterns, reporter);
  addArgs = deps.map(dep => dep.upgradeTo);

  if (flags.scope && validScopeRegex.test(flags.scope))
    addArgs = addArgs.filter(depName => depName.startsWith(flags.scope));

  const add = new Add(addArgs, addFlags, config, reporter, upgradeAll ? new Lockfile() : lockfile);
  await add.init();
}

async function getOutdated(config, reporter, flags, lockfile, patterns) {
  const install = new Install(flags, config, reporter, lockfile),
    outdatedFieldName = flags.latest ? 'latest' : 'wanted';

  const normalizeScope = function() {
    if (flags.scope) {
      flags.scope.startsWith('@') || (flags.scope = '@' + flags.scope);

      flags.scope.endsWith('/') || (flags.scope += '/');
    }
  };

  const versionFilter = function(dep) {
    return dep.current !== dep[outdatedFieldName];
  };

  if (!flags.latest) {
    flags.tilde = false;
    flags.exact = false;
    flags.caret = false;
  }

  normalizeScope();

  const deps = (await PackageRequest.getOutdatedPackages(lockfile, install, config, reporter, patterns, flags))
    .filter(versionFilter)
    .filter(scopeFilter.bind(this, flags));
  deps.forEach(dep => {
    dep.upgradeTo = buildPatternToUpgradeTo(dep, flags);
    reporter.verbose(reporter.lang('verboseUpgradeBecauseOutdated', dep.name, dep.upgradeTo));
  });

  return deps;
}

var upgrade = {
  __proto__: null,
  cleanLockfile,
  setFlags: setFlags$e,
  hasWrapper: hasWrapper$e,
  requireLockfile: requireLockfile$4,
  run: run$f,
  getOutdated,
};

function colorForVersions(from, to) {
  const validFrom = semver.valid(from),
    validTo = semver.valid(to);
  let versionBump = 'unknown';
  if (validFrom && validTo) versionBump = diffWithUnstable(validFrom, validTo) || 'unchanged';

  return VERSION_COLOR_SCHEME[versionBump];
}

function colorizeDiff(from, to, reporter) {
  const parts = to.split('.'),
    fromParts = from.split('.'),

    splitIndex = parts.findIndex((part, i) => part !== fromParts[i]);
  if (splitIndex < 0) return from;

  const colorized = reporter.format.green(parts.slice(splitIndex).join('.'));
  return parts.slice(0, splitIndex).concat(colorized).join('.');
}

const requireLockfile$5 = true;

function setFlags$f(commander) {
  commander.description('Provides an easy way to update outdated packages.');
  commander.usage('upgrade-interactive [flags]');
  commander.option('-S, --scope <scope>', 'upgrade packages under the specified scope');
  commander.option('--latest', 'list the latest version of packages, ignoring version ranges in package.json');
  commander.option('-E, --exact', 'install exact version. Only used when --latest is specified.');
  commander.option(
    '-T, --tilde',
    'install most recent release with the same minor version. Only used when --latest is specified.'
  );
  commander.option(
    '-C, --caret',
    'install most recent release with the same major version. Only used when --latest is specified.'
  );
}

function hasWrapper$f(commander, args) {
  return true;
}

async function run$g(config, reporter, flags, args) {
  const outdatedFieldName = flags.latest ? 'latest' : 'wanted',
    lockfile = await Lockfile.fromDirectory(config.lockfileFolder),

    deps = await getOutdated(config, reporter, {...flags, includeWorkspaceDeps: true}, lockfile, args);

  if (deps.length === 0) {
    reporter.success(reporter.lang('allDependenciesUpToDate'));
    return;
  }

  const install = new Install(flags, config, reporter, lockfile);
  await install.checkCompatibility();

  const usesWorkspaces = !!config.workspaceRootFolder;

  const maxLengthArr = {
    name: 'name'.length,
    current: 'from'.length,
    range: 'latest'.length,
    [outdatedFieldName]: 'to'.length,
    workspaceName: 'workspace'.length,
  };

  const keysWithDynamicLength = ['name', 'current', outdatedFieldName];

  if (!flags.latest) {
    maxLengthArr.range = 'range'.length;
    keysWithDynamicLength.push('range');
  }

  usesWorkspaces && keysWithDynamicLength.push('workspaceName');

  deps.forEach(dep =>
    keysWithDynamicLength.forEach(key => {
      maxLengthArr[key] = Math.max(maxLengthArr[key], dep[key].length);
    })
  );

  const addPadding = dep => key => `${dep[key]}${' '.repeat(maxLengthArr[key] - dep[key].length)}`,
    headerPadding = (header, key) =>
      `${reporter.format.bold.underline(header)}${' '.repeat(maxLengthArr[key] - header.length)}`,

    colorizeName = (from, to) => reporter.format[colorForVersions(from, to)],

    getNameFromHint = hint => (hint ? hint + 'Dependencies' : 'dependencies');

  const makeRow = dep => {
    const padding = addPadding(dep),
      name = colorizeName(dep.current, dep[outdatedFieldName])(padding('name')),
      current = reporter.format.blue(padding('current')),
      latest = colorizeDiff(dep.current, padding(outdatedFieldName), reporter),
      url = reporter.format.cyan(dep.url),
      range = reporter.format.blue(flags.latest ? 'latest' : padding('range'));

    return usesWorkspaces
      ? `${name}  ${range}  ${current}  ❯  ${latest}  ${padding('workspaceName')}  ${url}`
      : `${name}  ${range}  ${current}  ❯  ${latest}  ${url}`;
  };

  const makeHeaderRow = () => {
    const name = headerPadding('name', 'name'),
      range = headerPadding('range', 'range'),
      from = headerPadding('from', 'current'),
      to = headerPadding('to', outdatedFieldName),
      url = reporter.format.bold.underline('url');

    return usesWorkspaces
      ? `  ${name}  ${range}  ${from}     ${to}  ${headerPadding('workspace', 'workspaceName')}  ${url}`
      : `  ${name}  ${range}  ${from}     ${to}  ${url}`;
  };

  const groupedDeps = deps.reduce((acc, dep) => {
    const {hint, name, upgradeTo} = dep,
      version = dep[outdatedFieldName],
      key = getNameFromHint(hint),
      xs = acc[key] || [];
    acc[key] = xs.concat({name: makeRow(dep), value: dep, short: `${name}@${version}`, upgradeTo});
    return acc;
  }, {});

  const flatten = xs => xs.reduce((ys, y) => ys.concat(Array.isArray(y) ? flatten(y) : y), []);

  const choices = flatten(
    Object.keys(groupedDeps).map(key => [
      new inquirer.Separator(reporter.format.bold.underline.green(key)),
      new inquirer.Separator(makeHeaderRow()),
      groupedDeps[key],
      new inquirer.Separator(' '),
    ])
  );

  try {
    const red = reporter.format.red('<red>'),
      yellow = reporter.format.yellow('<yellow>'),
      green = reporter.format.green('<green>');
    reporter.info(reporter.lang('legendColorsForVersionUpdates', red, yellow, green));

    const answers = await reporter.prompt('Choose which packages to update.', choices, {
      name: 'packages',
      type: 'checkbox',
      validate: answer => !!answer.length || 'You must choose at least one package.',
    });

    const getPattern = ({upgradeTo}) => upgradeTo,
      isHint = x => ({hint}) => hint === x;

    for (const hint of [null, 'dev', 'optional', 'peer']) {
      flags.dev = hint === 'dev';
      flags.peer = hint === 'peer';
      flags.optional = hint === 'optional';
      flags.ignoreWorkspaceRootCheck = true;
      flags.includeWorkspaceDeps = false;
      flags.workspaceRootIsCwd = false;
      const deps = answers.filter(isHint(hint));
      if (deps.length) {
        const install = new Install(flags, config, reporter, lockfile),
          {requests: packagePatterns} = await install.fetchRequestFromCwd();
        const depsByWorkspace = deps.reduce((acc, dep) => {
          const {workspaceLoc} = dep,
            xs = acc[workspaceLoc] || [];
          acc[workspaceLoc] = xs.concat(dep);
          return acc;
        }, {});
        const cwd = config.cwd;
        for (const loc of Object.keys(depsByWorkspace)) {
          const patterns = depsByWorkspace[loc].map(getPattern);
          cleanLockfile(lockfile, deps, packagePatterns, reporter);
          reporter.info(reporter.lang('updateInstalling', getNameFromHint(hint)));
          if (loc !== '') config.cwd = path.resolve(path.dirname(loc));

          const add = new Add(patterns, flags, config, reporter, lockfile);
          await add.init();
          config.cwd = cwd;
        }
      }
    }
  } catch (e) {
    Promise.reject(e); //
  }
}

var upgradeInteractive = {
  __proto__: null,
  requireLockfile: requireLockfile$5,
  setFlags: setFlags$f,
  hasWrapper: hasWrapper$f,
  run: run$g,
};

class GlobalAdd extends Add {
  constructor(args, flags, config, reporter, lockfile) {
    super(args, flags, config, reporter, lockfile);

    this.linker.setTopLevelBinLinking(false);
  }

  maybeOutputSaveTree() {
    for (const pattern of this.addedPatterns)
      ls(this.resolver.getStrictResolvedPattern(pattern), this.reporter, true);

    return Promise.resolve();
  }

  _logSuccessSaveLockfile() {}
}

function hasWrapper$g(flags, args) {
  return args[0] !== 'bin' && args[0] !== 'dir';
}

async function updateCwd(config) {
  await mkdirp(config.globalFolder);

  await config.init({
    cwd: config.globalFolder,
    offline: config.offline,
    binLinks: true,
    globalFolder: config.globalFolder,
    cacheFolder: config._cacheRootFolder,
    linkFolder: config.linkFolder,
    enableDefaultRc: config.enableDefaultRc,
    extraneousYarnrcFiles: config.extraneousYarnrcFiles,
  });
}

async function getBins(config) {
  const dirs = [];
  for (const registryName of Object.keys(registries)) {
    const registry = config.registries[registryName];
    dirs.push(registry.loc);
  }

  const paths = new Set();
  for (const dir of dirs) {
    const binDir = path.join(dir, '.bin');

    if (await exists(binDir)) for (const name of await readdir(binDir)) paths.add(path.join(binDir, name));
  }
  return paths;
}

async function getGlobalPrefix$1(config, flags) {
  if (flags.prefix) return flags.prefix;
  if (config.getOption('prefix', true)) return String(config.getOption('prefix', true));
  if (process.env.PREFIX) return process.env.PREFIX;

  const potentialPrefixFolders = [FALLBACK_GLOBAL_PREFIX];
  process.platform === 'win32'
    ? process.env.LOCALAPPDATA && potentialPrefixFolders.unshift(path.join(process.env.LOCALAPPDATA, 'Yarn'))
    : potentialPrefixFolders.unshift(POSIX_GLOBAL_PREFIX);

  const binFolders = potentialPrefixFolders.map(prefix => path.join(prefix, 'bin')),
    prefixFolderQueryResult = await getFirstSuitableFolder(binFolders),
    prefix = prefixFolderQueryResult.folder && path.dirname(prefixFolderQueryResult.folder);

  if (!prefix) {
    config.reporter.warn(
      config.reporter.lang(
        'noGlobalFolder',
        prefixFolderQueryResult.skipped.map(item => path.dirname(item.folder)).join(', ')
      )
    );

    return FALLBACK_GLOBAL_PREFIX;
  }

  return prefix;
}

async function getBinFolder(config, flags) {
  const prefix = await getGlobalPrefix$1(config, flags);
  return path.resolve(prefix, 'bin');
}

async function initUpdateBins(config, reporter, flags) {
  const beforeBins = await getBins(config),
    binFolder = await getBinFolder(config, flags);

  function throwPermError(err, dest) {
    throw err.code === 'EACCES' ? new MessageError(reporter.lang('noPermission', dest)) : err;
  }

  return async function() {
    try {
      await mkdirp(binFolder);
    } catch (err) {
      throwPermError(err, binFolder);
    }

    const afterBins = await getBins(config);

    for (const src of beforeBins) {
      if (afterBins.has(src)) continue;

      const dest = path.join(binFolder, path.basename(src));
      try {
        await unlink(dest);
      } catch (err) {
        throwPermError(err, dest);
      }
    }

    for (const src of afterBins) {
      const dest = path.join(binFolder, path.basename(src));
      try {
        await unlink(dest);
        await linkBin(src, dest);
        process.platform !== 'win32' || dest.indexOf('.cmd') < 0 || (await rename(dest + '.cmd', dest));
      } catch (err) {
        throwPermError(err, dest);
      }
    }
  };
}

function ls(manifest, reporter, saved) {
  const bins = manifest.bin ? Object.keys(manifest.bin) : [],
    human = `${manifest.name}@${manifest.version}`;
  if (bins.length) {
    saved
      ? reporter.success(reporter.lang('packageInstalledWithBinaries', human))
      : reporter.info(reporter.lang('packageHasBinaries', human));

    reporter.list('bins-' + manifest.name, bins);
  } else saved && reporter.warn(reporter.lang('packageHasNoBinaries', human));
}

async function list$2(config, reporter, flags, args) {
  await updateCwd(config);

  const lockfile = await Lockfile.fromDirectory(config.cwd),
    install = new Install({}, config, new BaseReporter(), lockfile),
    patterns = await install.getFlattenedDeps();

  for (const pattern of patterns) ls(install.resolver.getStrictResolvedPattern(pattern), reporter, false);
}

const {run: run$h, setFlags: _setFlags$1} = buildSubCommands('global', {
  async add(config, reporter, flags, args) {
    await updateCwd(config);

    const updateBins = await initUpdateBins(config, reporter, flags);
    args.indexOf('yarn') < 0 || reporter.warn(reporter.lang('packageContainsYarnAsGlobal'));

    const lockfile = await Lockfile.fromDirectory(config.cwd),
      install = new GlobalAdd(args, flags, config, reporter, lockfile);
    await install.init();

    await updateBins();
  },

  async bin(config, reporter, flags, args) {
    reporter.log(await getBinFolder(config, flags), {force: true});
  },

  dir(config, reporter, flags, args) {
    reporter.log(config.globalFolder, {force: true});
    return Promise.resolve();
  },

  ls(config, reporter, flags, args) {
    reporter.warn('`yarn global ls` is deprecated. Please use `yarn global list`.');
    return list$2(config, reporter).then(noop);
  },

  list: (config, reporter, flags, args) => list$2(config, reporter).then(noop),

  async remove(config, reporter, flags, args) {
    await updateCwd(config);

    const updateBins = await initUpdateBins(config, reporter, flags);

    await run$e(config, reporter, flags, args);

    await updateBins();
  },

  async upgrade(config, reporter, flags, args) {
    await updateCwd(config);

    const updateBins = await initUpdateBins(config, reporter, flags);

    await run$f(config, reporter, flags, args);

    await updateBins();
  },

  async upgradeInteractive(config, reporter, flags, args) {
    await updateCwd(config);

    const updateBins = await initUpdateBins(config, reporter, flags);

    await run$g(config, reporter, flags, args);

    await updateBins();
  },
});

function setFlags$g(commander) {
  _setFlags$1(commander);
  commander.description('Installs packages globally on your operating system.');
  commander.option('--prefix <prefix>', 'bin prefix to use to install binaries');
  commander.option('--latest', 'upgrade to the latest version of packages');
}

var global$1 = {
  __proto__: null,
  hasWrapper: hasWrapper$g,
  getBinFolder,
  run: run$h,
  setFlags: setFlags$g,
};

function setFlags$h(commander) {
  commander.description('Creates new projects from any create-* starter kits.');
}

function hasWrapper$h(commander, args) {
  return true;
}

function parsePackageName(str) {
  if (str.charAt(0) === '/') throw new Error(`Name should not start with "/", got "${str}"`);
  if (str.charAt(0) === '.') throw new Error(`Name should not start with ".", got "${str}"`);

  const parts = str.split('/'),
    isScoped = str.charAt(0) === '@';
  if (isScoped && parts[0] === '@') throw new Error(`Scope should not be empty, got "${str}"`);

  const scope = isScoped ? parts[0] : '',
    name = parts[isScoped ? 1 : 0] || '',
    path = parts.slice(isScoped ? 2 : 1).join('/'),
    fullName = [scope, name].filter(Boolean).join('/'),
    full = [scope, name, path].filter(Boolean).join('/');

  return {fullName, name, scope, path, full};
}

function coerceCreatePackageName(str) {
  const pkgNameObj = parsePackageName(str),
    coercedName = pkgNameObj.name !== '' ? 'create-' + pkgNameObj.name : 'create';
  return {
    ...pkgNameObj,
    name: coercedName,
    fullName: [pkgNameObj.scope, coercedName].filter(Boolean).join('/'),
    full: [pkgNameObj.scope, coercedName, pkgNameObj.path].filter(Boolean).join('/'),
  };
}

async function run$i(config, reporter, flags, args) {
  const [builderName, ...rest] = args;

  if (!builderName) throw new MessageError(reporter.lang('invalidPackageName'));

  const {fullName: packageName, name: commandName} = coerceCreatePackageName(builderName),

    linkLoc = path.join(config.linkFolder, commandName);
  (await exists(linkLoc))
    ? reporter.info(reporter.lang('linkUsing', packageName))
    : await run$h(config, reporter, {}, ['add', packageName]);

  const binFolder = await getBinFolder(config, {}),
    command = path.resolve(binFolder, commandName),
    env = await makeEnv('create', config.cwd, config);

  await spawn(command, rest, {stdio: 'inherit', shell: true, env});
}

var create = {
  __proto__: null,
  setFlags: setFlags$h,
  hasWrapper: hasWrapper$h,
  parsePackageName,
  coerceCreatePackageName,
  run: run$i,
};

function setFlags$i(commander) {}

function hasWrapper$i(commander, args) {
  return true;
}

async function run$j(config, reporter, flags, args) {
  const env = await makeEnv('exec', config.cwd, config);

  if (args.length < 1) throw new MessageError(reporter.lang('execMissingCommand'));

  const [execName, ...rest] = args;
  await spawn(execName, rest, {stdio: 'inherit', env});
}

var exec$1 = {
  __proto__: null,
  setFlags: setFlags$i,
  hasWrapper: hasWrapper$i,
  run: run$j,
};

function hasWrapper$j(commander, args) {
  return false;
}

async function run$k(config, reporter, flags, args) {
  let manifest = flags.useManifest ? await config.readJson(flags.useManifest) : await config.readRootManifest();

  if (!manifest.name) throw new MessageError(reporter.lang('noName'));
  if (!manifest.version) throw new MessageError(reporter.lang('noVersion'));

  const entry = {
    name: manifest.name,
    version: manifest.version,
    resolved: flags.resolved,
    registry: flags.registry || manifest._registry,
    optionalDependencies: manifest.optionalDependencies,
    dependencies: manifest.dependencies,
  };
  const pattern = flags.pattern || `${entry.name}@${entry.version}`;
  reporter.log(Lockfile.stringify({[pattern]: Lockfile.implodeEntry(pattern, entry)}));
}

function setFlags$j(commander) {
  commander.description('Generates a lock file entry.');
  commander.option('--use-manifest <location>', 'description');
  commander.option('--resolved <resolved>', 'description');
  commander.option('--registry <registry>', 'description');
}

const examples$3 = [
  'generate-lock-entry',
  'generate-lock-entry --use-manifest ./package.json',
  'generate-lock-entry --resolved local-file.tgz#hash',
];

var generateLockEntry = {
  __proto__: null,
  hasWrapper: hasWrapper$j,
  run: run$k,
  setFlags: setFlags$j,
  examples: examples$3,
};

var aliases$1 = {'upgrade-interactive': 'upgradeInteractive', 'generate-lock-entry': 'generateLockEntry'};

function hasWrapper$k(flags, args) {
  return false;
}

function setFlags$k(commander) {
  commander.description('Displays help information.');
}

function run$l(config, reporter, commander, args) {
  if (args.length) {
    const commandName = args.shift();
    if (Object.prototype.hasOwnProperty.call(commands, commandName)) {
      const command = commands[commandName];
      if (command) {
        command.setFlags(commander);
        const examples = (command.examples || []).map(example => '    $ yarn ' + example);
        examples.length &&
          commander.on('--help', () => {
            reporter.log(reporter.lang('helpExamples', reporter.rawText(examples.join('\n'))));
          });

        commander.on('--help', () => reporter.log('  ' + command.getDocsInfo + '\n'));
        commander.help();
        return Promise.resolve();
      }
    }
  }

  commander.on('--help', () => {
    const commandsText = [];
    for (const name of Object.keys(commands).sort(sortAlpha)) {
      if (commands[name].useless || Object.keys(aliases$1).map(key => aliases$1[key]).indexOf(name) > -1) continue;

      aliases$1[name]
        ? commandsText.push(`    - ${hyphenate(name)} / ${aliases$1[name]}`)
        : commandsText.push('    - ' + hyphenate(name));
    }
    reporter.log(reporter.lang('helpCommands', reporter.rawText(commandsText.join('\n'))));
    reporter.log(reporter.lang('helpCommandsMore', reporter.rawText(chalk.bold('yarn help COMMAND'))));
    reporter.log(reporter.lang('helpLearnMore', reporter.rawText(chalk.bold(YARN_DOCS))));
  });

  commander.options.sort(sortOptionsByFlags);

  commander.help();
  return Promise.resolve();
}

var help = {
  __proto__: null,
  hasWrapper: hasWrapper$k,
  setFlags: setFlags$k,
  run: run$l,
};

class LogicalDependencyTree {
  constructor(packageJson, packageLock) {
    this.tree = npmLogicalTree(JSON.parse(packageJson), JSON.parse(packageLock));
  }

  _findNode(name, parentNames) {
    return (
      parentNames ? parentNames.reduce((node, ancestor) => node.dependencies.get(ancestor), this.tree) : this.tree
    ).dependencies.get(name);
  }
  getFixedVersionPattern(name, parentNames) {
    const node = this._findNode(name, parentNames),
      version = node.version;
    return `${node.name}@${version}`;
  }
}

const nodeVersion = process.versions.node.split('-')[0],

  noArguments$2 = true;

class ImportResolver extends BaseResolver {
  getCwd() {
    if (this.request.parentRequest) {
      const parent = this.resolver.getStrictResolvedPattern(this.request.parentRequest.pattern);
      invariant(parent._loc, 'expected package location');
      return path.dirname(parent._loc);
    }
    return this.config.cwd;
  }

  resolveHostedGit(info, Resolver) {
    const {range} = normalizePattern(this.pattern),
      exploded = explodeHostedGitFragment(range, this.reporter),
      hash = info.gitHead;
    invariant(hash, 'expected package gitHead');
    const url = Resolver.getTarballUrl(exploded, hash);
    info._uid = hash;
    info._remote = {resolved: url, type: 'tarball', registry: this.registry, reference: url, hash: null};
    return info;
  }

  resolveGist(info, Resolver) {
    const {range} = normalizePattern(this.pattern),
      {id} = explodeGistFragment(range, this.reporter),
      hash = info.gitHead;
    invariant(hash, 'expected package gitHead');
    const url = `https://gist.github.com/${id}.git`;
    info._uid = hash;
    info._remote = {resolved: `${url}#${hash}`, type: 'git', registry: this.registry, reference: url, hash};
    return info;
  }

  resolveGit(info, Resolver) {
    const url = info._resolved,
      hash = info.gitHead;
    invariant(url, 'expected package _resolved');
    invariant(hash, 'expected package gitHead');
    info._uid = hash;
    info._remote = {resolved: `${url}#${hash}`, type: 'git', registry: this.registry, reference: url, hash};
    return info;
  }

  resolveFile(info, Resolver) {
    const {range} = normalizePattern(this.pattern);
    let loc = removePrefix(range, 'file:');
    path.isAbsolute(loc) || (loc = path.join(this.config.cwd, loc));

    info._uid = info.version;
    info._remote = {
      type: 'copy',
      registry: this.registry,
      hash: `${uuid.v4()}-${new Date().getTime()}`,
      reference: loc,
    };
    return info;
  }

  resolveRegistry(info) {
    let url = info._resolved;
    const hash = info._shasum;
    invariant(url, 'expected package _resolved');
    invariant(hash, 'expected package _shasum');
    if (this.config.getOption('registry') === YARN_REGISTRY) url = url.replace(NPM_REGISTRY_RE, YARN_REGISTRY);

    info._uid = info.version;
    info._remote = {
      resolved: `${url}#${hash}`,
      type: 'tarball',
      registry: this.registry,
      reference: url,
      integrity: info._integrity ? ssri.parse(info._integrity) : ssri.fromHex(hash, 'sha1'),
      hash,
    };
    return info;
  }

  resolveImport(info) {
    const {range} = normalizePattern(this.pattern),
      Resolver = getExoticResolver(range);
    return Resolver && Resolver.prototype instanceof HostedGitResolver
      ? this.resolveHostedGit(info, Resolver)
      : Resolver && Resolver === GistResolver
      ? this.resolveGist(info, Resolver)
      : Resolver && Resolver === GitResolver
      ? this.resolveGit(info, Resolver)
      : Resolver && Resolver === FileResolver
      ? this.resolveFile(info, Resolver)
      : this.resolveRegistry(info);
  }

  async resolveLocation(loc) {
    const info = await this.config.tryManifest(loc, 'npm', false);
    return info ? this.resolveImport(info) : null;
  }

  async resolveFixedVersion(fixedVersionPattern) {
    const {range} = normalizePattern(fixedVersionPattern),
      exoticResolver = getExoticResolver(range);
    return exoticResolver
      ? await this.request.findExoticVersionInfo(exoticResolver, range)
      : await this.request.findVersionOnRegistry(fixedVersionPattern);
  }

  async _resolveFromFixedVersions() {
    invariant(this.request instanceof ImportPackageRequest, 'request must be ImportPackageRequest');
    const {name} = normalizePattern(this.pattern);
    invariant(
      this.request.dependencyTree instanceof LogicalDependencyTree,
      'dependencyTree on request must be LogicalDependencyTree'
    );
    const fixedVersionPattern = this.request.dependencyTree.getFixedVersionPattern(name, this.request.parentNames);
    const info = await this.config.getCache('import-resolver-' + fixedVersionPattern, () =>
      this.resolveFixedVersion(fixedVersionPattern)
    );
    if (info) return info;

    throw new MessageError(this.reporter.lang('importResolveFailed', name, this.getCwd()));
  }

  async _resolveFromNodeModules() {
    const {name} = normalizePattern(this.pattern);
    for (let cwd = this.getCwd(); !path.relative(this.config.cwd, cwd).startsWith('..'); ) {
      const loc = path.join(cwd, 'node_modules', name),
        info = await this.config.getCache('import-resolver-' + loc, () => this.resolveLocation(loc));
      if (info) return info;

      cwd = path.resolve(cwd, '../..');
    }
    throw new MessageError(this.reporter.lang('importResolveFailed', name, this.getCwd()));
  }

  resolve() {
    return this.request instanceof ImportPackageRequest && this.request.dependencyTree
      ? this._resolveFromFixedVersions()
      : this._resolveFromNodeModules();
  }
}

class ImportPackageRequest extends PackageRequest {
  constructor(req, dependencyTree, resolver) {
    super(req, resolver);
    this.import = !(this.parentRequest instanceof ImportPackageRequest) || this.parentRequest.import;
    this.dependencyTree = dependencyTree;
  }

  getRootName() {
    return (this.resolver instanceof ImportPackageResolver && this.resolver.rootName) || 'root';
  }

  getParentHumanName() {
    return [this.getRootName()].concat(this.parentNames).join(' > ');
  }

  reportResolvedRangeMatch(info, resolved) {
    if (info.version === resolved.version) return;

    this.reporter.warn(
      this.reporter.lang(
        'importResolvedRangeMatch',
        resolved.version,
        resolved.name,
        info.version,
        this.getParentHumanName()
      )
    );
  }

  _findResolvedManifest(info) {
    const {range, name} = normalizePattern(this.pattern),
      solvedRange = semver.validRange(range) ? info.version : range,
      resolved = this.resolver.getExactVersionMatch(name, solvedRange, info);
    if (resolved) return resolved;

    invariant(info._remote, 'expected package remote');
    const ref = new PackageReference(this, info, info._remote);
    info._reference = ref;
    return info;
  }

  resolveToExistingVersion(info) {
    const resolved = this._findResolvedManifest(info);
    invariant(resolved, 'should have found a resolved reference');
    const ref = resolved._reference;
    invariant(ref, 'should have a package reference');
    ref.addRequest(this);
    ref.addPattern(this.pattern, resolved);
    ref.addOptional(this.optional);
  }

  findVersionInfo() {
    if (!this.import) {
      this.reporter.verbose(this.reporter.lang('skippingImport', this.pattern, this.getParentHumanName()));
      return super.findVersionInfo();
    }
    return new ImportResolver(this, this.pattern).resolve().catch(() => {
      this.import = false;
      this.reporter.warn(this.reporter.lang('importFailed', this.pattern, this.getParentHumanName()));
      return super.findVersionInfo();
    });
  }
}

class ImportPackageResolver extends PackageResolver {
  constructor(config, lockfile) {
    super(config, lockfile);
    this.next = [];
    this.rootName = 'root';
  }

  find(req) {
    this.next.push(req);
    return Promise.resolve();
  }

  async findOne(req) {
    this.activity && this.activity.tick(req.pattern);

    const request = new ImportPackageRequest(req, this.dependencyTree, this);
    await request.find({fresh: false});
  }

  async findAll(deps) {
    await Promise.all(deps.map(dep => this.findOne(dep)));
    deps = this.next;
    this.next = [];
    deps.length ? await this.findAll(deps) : this.resolvePackagesWithExistingVersions();
  }

  resetOptional() {
    for (const pattern in this.patterns) {
      const ref = this.patterns[pattern]._reference;
      invariant(ref, 'expected reference');
      ref.optional = null;
      for (const req of ref.requests) ref.addOptional(req.optional);
    }
  }

  async init(deps, {isFlat, isFrozen, workspaceLayout} = {isFlat: false, isFrozen: false, workspaceLayout: void 0}) {
    this.flat = Boolean(isFlat);
    const activity = (this.activity = this.reporter.activity());
    await this.findAll(deps);
    this.resetOptional();
    activity.end();
    this.activity = null;
  }
}

class Import extends Install {
  constructor(flags, config, reporter, lockfile) {
    super(flags, config, reporter, lockfile);
    this.resolver = new ImportPackageResolver(this.config, this.lockfile);
    this.linker = new PackageLinker(config, this.resolver);
  }
  createLogicalDependencyTree(packageJson, packageLock) {
    invariant(packageJson, 'package.json should exist');
    invariant(packageLock, 'package-lock.json should exist');
    invariant(this.resolver instanceof ImportPackageResolver, 'resolver should be an ImportPackageResolver');
    try {
      this.resolver.dependencyTree = new LogicalDependencyTree(packageJson, packageLock);
    } catch (_e) {
      throw new MessageError(this.reporter.lang('importSourceFilesCorrupted'));
    }
  }
  async getExternalLockfileContents() {
    try {
      const [packageJson, packageLock] = await Promise.all([
        readFile(path.join(this.config.cwd, NODE_PACKAGE_JSON)),
        readFile(path.join(this.config.cwd, NPM_LOCK_FILENAME)),
      ]);
      return {packageJson, packageLock};
    } catch (_e) {
      return {packageJson: null, packageLock: null};
    }
  }
  async init() {
    if (await exists(path.join(this.config.cwd, LOCKFILE_FILENAME)))
      throw new MessageError(this.reporter.lang('lockfileExists'));

    const {packageJson, packageLock} = await this.getExternalLockfileContents(),
      importSource =
        packageJson && packageLock && semver.satisfies(nodeVersion, '>=5.0.0') ? 'package-lock.json' : 'node_modules';
    if (importSource === 'package-lock.json') {
      this.reporter.info(this.reporter.lang('importPackageLock'));
      this.createLogicalDependencyTree(packageJson, packageLock);
    }
    if (importSource === 'node_modules') {
      this.reporter.info(this.reporter.lang('importNodeModules'));
      await verifyTreeCheck(this.config, this.reporter);
    }
    const {requests, patterns, manifest} = await this.fetchRequestFromCwd();
    if (manifest.name && this.resolver instanceof ImportPackageResolver) this.resolver.rootName = manifest.name;

    await this.resolver.init(requests, {isFlat: this.flags.flat, isFrozen: this.flags.frozenLockfile});
    const manifests = await fetch(this.resolver.getManifests(), this.config);
    this.resolver.updateManifests(manifests);
    await check(this.resolver.getManifests(), this.config, this.flags.ignoreEngines);
    await this.linker.resolvePeerModules();
    await this.saveLockfileAndIntegrity(patterns);
    return patterns;
  }
}

function setFlags$l(commander) {
  commander.description(
    'Generates yarn.lock from an npm package-lock.json file or an existing npm-installed node_modules folder.'
  );
}

function hasWrapper$l(commander, args) {
  return true;
}

async function run$m(config, reporter, flags, args) {
  const imp = new Import(flags, config, reporter, new Lockfile({cache: {}}));
  await imp.init();
}

var import_ = {
  __proto__: null,
  noArguments: noArguments$2,
  Import,
  setFlags: setFlags$l,
  hasWrapper: hasWrapper$l,
  run: run$m,
};

const PKG_INPUT = /(^\S?[^\s@]+)(?:@(\S+))?$/;

function parsePackageName$1(input) {
  const [, name, version] = PKG_INPUT.exec(input);
  return {name, version};
}

function clean$3(object) {
  if (Array.isArray(object)) {
    const result = [];
    object.forEach(item => {
      (item = clean$3(item)) && result.push(item);
    });
    return result;
  }
  if (typeof object == 'object') {
    const result = {};
    for (const key in object) {
      if (key.startsWith('_')) continue;

      const item = clean$3(object[key]);
      if (item) result[key] = item;
    }
    return result;
  }
  return object || null;
}

function setFlags$m(commander) {
  commander.description('Shows information about a package.');
}

function hasWrapper$m(commander, args) {
  return true;
}

async function run$n(config, reporter, flags, args) {
  if (args.length > 2) {
    reporter.error(reporter.lang('tooManyArguments', 2));
    return;
  }

  let packageName = args.shift() || '.';

  if (packageName === '.') packageName = (await config.readRootManifest()).name;

  const packageInput = NpmRegistry.escapeName(packageName),
    {name, version} = parsePackageName$1(packageInput);

  let result;
  try {
    result = await config.registries.npm.request(name, {unfiltered: true});
  } catch (_e) {
    reporter.error(reporter.lang('infoFail'));
    return;
  }
  if (!result) {
    reporter.error(reporter.lang('infoFail'));
    return;
  }

  result = clean$3(result);

  const versions = result.versions;
  result.versions = Object.keys(versions).sort(semver.compareLoose);
  result.version = version || result['dist-tags'].latest;
  result = Object.assign(result, versions[result.version]);

  const fieldPath = args.shift(),
    fields = fieldPath ? fieldPath.split('.') : [];

  fields[0] === 'readme' || delete result.readme;

  result = fields.reduce((prev, cur) => prev && prev[cur], result);
  reporter.inspect(result);
}

var info = {
  __proto__: null,
  setFlags: setFlags$m,
  hasWrapper: hasWrapper$m,
  run: run$n,
};

function setFlags$n(commander) {
  commander.description('Interactively creates or updates a package.json file.');
  commander.option('-y, --yes', 'use default options');
  commander.option('-p, --private', 'use default options and private true');
  commander.option('-i, --install <value>', 'install a specific Yarn release');
  commander.option('-2', 'generates the project using Yarn 2');
}

function hasWrapper$n(commander, args) {
  return true;
}

const shouldRunInCurrentCwd = true;

async function run$o(config, reporter, flags, args) {
  const installVersion = flags[2] ? 'berry' : flags.install,
    forwardedArgs = process.argv.slice(process.argv.indexOf('init', 2) + 1);

  if (installVersion) {
    if (flags[2] && process.env.COREPACK_ROOT)
      await spawn(
        NODE_BIN_PATH,
        [
          path.join(process.env.COREPACK_ROOT, 'dist/corepack.js'),
          `yarn@${flags.install || 'stable'}`,
          'init',
          ...forwardedArgs,
          '--install=self',
        ],
        {stdio: 'inherit', cwd: config.cwd}
      );
    else {
      const lockfilePath = path.resolve(config.cwd, 'yarn.lock');
      (await exists(lockfilePath)) || (await writeFile(lockfilePath, ''));

      await spawn(NODE_BIN_PATH, [process.argv[1], 'policies', 'set-version', installVersion, '--silent'], {
        stdio: 'inherit',
        cwd: config.cwd,
      });
      await spawn(NODE_BIN_PATH, [process.argv[1], 'init', ...forwardedArgs], {stdio: 'inherit', cwd: config.cwd});
    }
    return;
  }

  const manifests = await config.getRootManifests();

  let repository = {};
  const author = {
    name: config.getOption('init-author-name'),
    email: config.getOption('init-author-email'),
    url: config.getOption('init-author-url'),
  };
  if (await exists(path.join(config.cwd, '.git'))) {
    try {
      repository = {
        type: 'git',
        url: await spawn('git', ['config', 'remote.origin.url'], {cwd: config.cwd}),
      };
    } catch (_ex) {}

    if (author.name === void 0) author.name = await getGitConfigInfo('user.name');

    if (author.email === void 0) author.email = await getGitConfigInfo('user.email');
  }

  const keys = [
    {
      key: 'name',
      question: 'name',
      default: path.basename(config.cwd),
      validation: isValidPackageName,
      validationError: 'invalidPackageName',
    },
    {key: 'version', question: 'version', default: String(config.getOption('init-version'))},
    {key: 'description', question: 'description', default: ''},
    {key: 'main', question: 'entry point', default: 'index.js'},
    {key: 'repository', question: 'repository url', default: extractRepositoryUrl(repository)},
    {key: 'author', question: 'author', default: stringifyPerson(author)},
    {key: 'license', question: 'license', default: String(config.getOption('init-license'))},
    {key: 'private', question: 'private', default: config.getOption('init-private') || '', inputFormatter: yn},
  ];

  const pkg = {};
  for (const entry of keys) {
    const {yes, private: privateFlag} = flags,
      {key: manifestKey} = entry;
    let {question, default: def} = entry;

    for (const registryName of registryNames) {
      const {object} = manifests[registryName];
      let val = objectPath.get(object, manifestKey);
      if (!val) break;

      if (typeof val == 'object')
        if (manifestKey === 'author') val = stringifyPerson(val);
        else if (manifestKey === 'repository') val = extractRepositoryUrl(val);

      def = val;
    }

    if (manifestKey === 'private' && privateFlag) def = true;

    if (def) question += ` (${String(def)})`;

    let answer,
      validAnswer = false;

    if (yes) answer = def;
    else if (entry.validation)
      while (!validAnswer) {
        answer = (await reporter.question(question)) || def;
        entry.validation(String(answer))
          ? (validAnswer = true)
          : reporter.error(reporter.lang('invalidPackageName'));
      }
    else answer = (await reporter.question(question)) || def;

    if (answer) {
      if (entry.inputFormatter) answer = entry.inputFormatter(answer);

      objectPath.set(pkg, manifestKey, answer);
    }
  }

  if (pkg.repository && GitHubResolver.isVersion(pkg.repository))
    pkg.repository = 'https://github.com/' + pkg.repository;

  const targetManifests = [];
  for (const registryName of registryNames) {
    const info = manifests[registryName];
    info.exists && targetManifests.push(info);
  }
  targetManifests.length || targetManifests.push(manifests.npm);

  for (const targetManifest of targetManifests) {
    Object.assign(targetManifest.object, pkg);
    reporter.success('Saved ' + path.basename(targetManifest.loc));
  }

  await config.saveRootManifests(manifests);
}

function getGitConfigInfo(credential, spawn$1 = spawn) {
  return spawn$1('git', ['config', credential]).catch(_e => ''); // .then(x => x)
}

var init = {
  __proto__: null,
  setFlags: setFlags$n,
  hasWrapper: hasWrapper$n,
  shouldRunInCurrentCwd,
  run: run$o,
  getGitConfigInfo,
};

function hasWrapper$o(flags, args) {
  return args[0] != 'generate-disclaimer';
}

async function getManifests(config, flags) {
  const lockfile = await Lockfile.fromDirectory(config.cwd),
    install = new Install({skipIntegrityCheck: true, ...flags}, config, new BaseReporter(), lockfile);
  await install.hydrate(true);

  let manifests = install.resolver.getManifests();

  manifests = manifests.sort(function(a, b) {
    return !a.name && !b.name ? 0 : !a.name ? 1 : b.name ? a.name.localeCompare(b.name) : -1;
  });

  manifests = manifests.filter((manifest) => {
    const ref = manifest._reference;
    return !!ref && !ref.ignore;
  });

  return manifests;
}

async function list$3(config, reporter, flags, args) {
  const manifests = await getManifests(config, flags);
  const manifestsByLicense = new Map();

  for (const {name, version, license, repository, homepage, author} of manifests) {
    const licenseKey = license || 'UNKNOWN',
      url = repository ? repository.url : homepage,
      vendorUrl = homepage || (author && author.url),
      vendorName = author && author.name;

    manifestsByLicense.has(licenseKey) || manifestsByLicense.set(licenseKey, new Map());

    const byLicense = manifestsByLicense.get(licenseKey);
    invariant(byLicense, 'expected value');
    byLicense.set(`${name}@${version}`, {name, version, url, vendorUrl, vendorName});
  }

  if (flags.json) {
    const body = [];

    manifestsByLicense.forEach((license, licenseKey) => {
      license.forEach(({name, version, url, vendorUrl, vendorName}) => {
        body.push([name, version, licenseKey, url || 'Unknown', vendorUrl || 'Unknown', vendorName || 'Unknown']);
      });
    });

    reporter.table(['Name', 'Version', 'License', 'URL', 'VendorUrl', 'VendorName'], body);
  } else {
    const trees = [];

    manifestsByLicense.forEach((license, licenseKey) => {
      const licenseTree = [];

      license.forEach(({name, version, url, vendorUrl, vendorName}) => {
        const children = [];

        url && children.push({name: `${reporter.format.bold('URL:')} ${url}`});

        vendorUrl && children.push({name: `${reporter.format.bold('VendorUrl:')} ${vendorUrl}`});

        vendorName && children.push({name: `${reporter.format.bold('VendorName:')} ${vendorName}`});

        licenseTree.push({name: `${name}@${version}`, children});
      });

      trees.push({name: licenseKey, children: licenseTree});
    });

    reporter.tree('licenses', trees, {force: true});
  }
}
function setFlags$o(commander) {
  commander.description('Lists licenses for installed packages.');
}
const {run: run$p, examples: examples$4} = buildSubCommands('licenses', {
  ls(config, reporter, flags, args) {
    reporter.warn('`yarn licenses ls` is deprecated. Please use `yarn licenses list`.');
    return list$3(config, reporter, flags).then(noop);
  },

  list: (config, reporter, flags, args) => list$3(config, reporter, flags).then(noop),

  async generateDisclaimer(config, reporter, flags, args) {
    const manifests = await getManifests(config, flags),
      manifest = await config.readRootManifest(),

      manifestsByLicense = new Map();
    for (const manifest of manifests) {
      const {licenseText, noticeText} = manifest;
      let licenseKey;
      if (!licenseText) continue;

      licenseKey = noticeText ? `${licenseText}\n\nNOTICE\n\n${noticeText}` : licenseText;

      manifestsByLicense.has(licenseKey) || manifestsByLicense.set(licenseKey, new Map());

      const byLicense = manifestsByLicense.get(licenseKey);
      invariant(byLicense, 'expected value');
      byLicense.set(manifest.name, manifest);
    }

    console.log(
      `THE FOLLOWING SETS FORTH ATTRIBUTION NOTICES FOR THIRD PARTY SOFTWARE THAT MAY BE CONTAINED IN PORTIONS OF THE ${String(
        manifest.name
      ).toUpperCase().replace(/-/g, ' ')} PRODUCT.`
    );
    console.log();

    for (const [licenseKey, manifests] of manifestsByLicense) {
      console.log('-----');
      console.log();

      const names = [],
        urls = [];
      for (const [name, {repository}] of manifests) {
        names.push(name);
        repository && repository.url &&
          urls.push(manifests.size === 1 ? repository.url : `${repository.url} (${name})`);
      }

      const heading = [];
      heading.push(`The following software may be included in this product: ${names.join(', ')}.`);
      urls.length > 0 && heading.push(`A copy of the source code may be downloaded from ${urls.join(', ')}.`);

      heading.push('This software contains the following license and notice below:');

      console.log(heading.join(' '));
      console.log();

      licenseKey && console.log(licenseKey.trim());

      console.log();
    }
  },
});

var licenses = {
  __proto__: null,
  hasWrapper: hasWrapper$o,
  setFlags: setFlags$o,
  run: run$p,
  examples: examples$4,
};

function getRegistryFolder(config, name) {
  if (config.modulesFolder) return Promise.resolve(config.modulesFolder);

  const src = path.join(config.linkFolder, name);
  return config.readManifest(src).then(({_registry}) => {
    invariant(_registry, 'expected registry');

    const registryFolder = config.registries[_registry].folder;
    return path.join(config.cwd, registryFolder);
  });
}

function hasWrapper$p(commander, args) {
  return true;
}

function setFlags$p(commander) {
  commander.description('Symlink a package folder during development.');
}

async function run$q(config, reporter, flags, args) {
  if (args.length)
    for (const name of args) {
      const src = path.join(config.linkFolder, name);

      if (!(await exists(src))) throw new MessageError(reporter.lang('linkMissing', name));

      const folder = await getRegistryFolder(config, name),
        dest = path.join(folder, name);

      await unlink(dest);
      await mkdirp(path.dirname(dest));
      await symlink(src, dest);
      reporter.success(reporter.lang('linkUsing', name));
    }
  else {
    const manifest = await config.readRootManifest(),
      name = manifest.name;
    if (!name) throw new MessageError(reporter.lang('unknownPackageName'));

    const linkLoc = path.join(config.linkFolder, name);
    if (await exists(linkLoc)) reporter.warn(reporter.lang('linkCollision', name));
    else {
      await mkdirp(path.dirname(linkLoc));
      await symlink(config.cwd, linkLoc);

      if (manifest.bin) {
        const globalBinFolder = await getBinFolder(config, flags);
        for (const binName in manifest.bin) {
          const binSrc = manifest.bin[binName],
            binSrcLoc = path.join(linkLoc, binSrc),
            binDestLoc = path.join(globalBinFolder, binName);

          (await exists(binDestLoc))
            ? reporter.warn(reporter.lang('binLinkCollision', binName))
            : process.platform === 'win32'
            ? await cmdShim(binSrcLoc, binDestLoc, {createPwshFile: false})
            : await symlink(binSrcLoc, binDestLoc);
        }
      }

      reporter.success(reporter.lang('linkRegistered', name));
      reporter.info(reporter.lang('linkRegisteredMessage', name));
    }
  }
}

var link$1 = {
  __proto__: null,
  getRegistryFolder,
  hasWrapper: hasWrapper$p,
  setFlags: setFlags$p,
  run: run$q,
};

function setFlags$q(commander) {
  commander.description('Clears registry username and email.');
}

function hasWrapper$q(commander, args) {
  return true;
}

function run$r(config, reporter, flags, args) {
  return config.registries.yarn.saveHomeConfig({username: void 0, email: void 0}).then(() => {
    reporter.success(reporter.lang('clearedCredentials'));
  });
}

var logout = {
  __proto__: null,
  setFlags: setFlags$q,
  hasWrapper: hasWrapper$q,
  run: run$r,
};

function setFlags$r(commander) {
  commander.description(
    'Runs Node with the same version that the one used by Yarn itself, and by default from the project root'
  );
  commander.usage('node [--into PATH] [... args]');
  commander.option('--into <path>', 'Sets the cwd to the specified location');
}

function hasWrapper$r(commander, args) {
  return true;
}

async function run$s(config, reporter, flags, args) {
  const pnpPath = `${config.lockfileFolder}/${PNP_FILENAME}`;

  let nodeOptions = process.env.NODE_OPTIONS || '';
  if (await exists(pnpPath)) nodeOptions = `--require ${pnpPath} ${nodeOptions}`; // await

  //try {
  await spawn(NODE_BIN_PATH, args, {
    stdio: 'inherit',
    cwd: flags.into || config.cwd,
    env: {...process.env, NODE_OPTIONS: nodeOptions},
  });
  //} catch (err) { throw err; }
}

var node = {
  __proto__: null,
  setFlags: setFlags$r,
  hasWrapper: hasWrapper$r,
  run: run$s,
};

const requireLockfile$6 = true;

function setFlags$s(commander) {
  commander.description('Checks for outdated package dependencies.');
  commander.usage('outdated [packages ...]');
}

function hasWrapper$s(commander, args) {
  return true;
}

async function run$t(config, reporter, flags, args) {
  const lockfile = await Lockfile.fromDirectory(config.lockfileFolder),
    install = new Install({...flags, includeWorkspaceDeps: true}, config, reporter, lockfile);
  let deps = await PackageRequest.getOutdatedPackages(lockfile, install, config, reporter);

  if (args.length) {
    const requested = new Set(args);

    deps = deps.filter(({name}) => requested.has(name));
  }

  const getNameFromHint = hint => (hint ? hint + 'Dependencies' : 'dependencies'),
    colorizeName = ({current, latest, name}) => reporter.format[colorForVersions(current, latest)](name);

  if (deps.length) {
    const usesWorkspaces = !!config.workspaceRootFolder;
    const body = deps.map((info) => {
      const row = [
        colorizeName(info),
        info.current,
        colorizeDiff(info.current, info.wanted, reporter),
        reporter.format.cyan(info.latest),
        info.workspaceName || '',
        getNameFromHint(info.hint),
        reporter.format.cyan(info.url),
      ];
      usesWorkspaces || row.splice(4, 1);

      return row;
    });

    const red = reporter.format.red('<red>'),
      yellow = reporter.format.yellow('<yellow>'),
      green = reporter.format.green('<green>');
    reporter.info(reporter.lang('legendColorsForVersionUpdates', red, yellow, green));

    const header = ['Package', 'Current', 'Wanted', 'Latest', 'Workspace', 'Package Type', 'URL'];
    usesWorkspaces || header.splice(4, 1);
    reporter.table(header, body);

    return 1;
  }
  return 0;
}

var outdated = {
  __proto__: null,
  requireLockfile: requireLockfile$6,
  setFlags: setFlags$s,
  hasWrapper: hasWrapper$s,
  run: run$t,
};

async function getName(args, config) {
  let name = args.shift();

  name || (name = (await config.readRootManifest()).name);

  if (name) {
    if (!isValidPackageName(name)) throw new MessageError(config.reporter.lang('invalidPackageName'));

    return NpmRegistry.escapeName(name);
  }
  throw new MessageError(config.reporter.lang('unknownPackageName'));
}

function list$4(config, reporter, flags, args) {
  return getName(args, config).then(name => {
    reporter.step(1, 1, reporter.lang('gettingTags'));

    return config.registries.npm.request(`-/package/${name}/dist-tags`).then(tags => {
      if (!tags) throw new MessageError(reporter.lang('packageNotFoundRegistry', name, 'npm'));

      reporter.info('Package ' + name);
      for (const name in tags) reporter.info(`${name}: ${tags[name]}`);
    });
  });
}

async function remove$1(config, reporter, flags, args) {
  if (args.length !== 2) return false;

  const name = await getName(args, config),
    tag = args.shift();

  reporter.step(1, 3, reporter.lang('loggingIn'));
  const revoke = await getToken(config, reporter, name);

  reporter.step(2, 3, reporter.lang('deletingTags'));
  const result = await config.registries.npm.request(`-/package/${name}/dist-tags/${encodeURI(tag)}`, {
    method: 'DELETE',
  });

  result === false ? reporter.error(reporter.lang('deletedTagFail')) : reporter.success(reporter.lang('deletedTag'));

  reporter.step(3, 3, reporter.lang('revokingToken'));
  await revoke();

  if (result === false) throw new Error();
  return true;
}

function setFlags$t(commander) {
  commander.description('Add, remove, or list tags on a package.');
}

const {run: run$u, hasWrapper: hasWrapper$t, examples: examples$5} = buildSubCommands(
  'tag',
  {
    async add(config, reporter, flags, args) {
      if (args.length !== 2) return false;

      const {name, range, hasVersion} = normalizePattern(args.shift());
      if (!hasVersion) throw new MessageError(reporter.lang('requiredVersionInRange'));
      if (!isValidPackageName(name)) throw new MessageError(reporter.lang('invalidPackageName'));

      const tag = args.shift();

      reporter.step(1, 3, reporter.lang('loggingIn'));
      const revoke = await getToken(config, reporter, name);

      reporter.step(2, 3, reporter.lang('creatingTag', tag, range));
      const result = await config.registries.npm.request(
        `-/package/${NpmRegistry.escapeName(name)}/dist-tags/${encodeURI(tag)}`,
        {method: 'PUT', body: range}
      );

      result != null && result.ok
        ? reporter.success(reporter.lang('createdTag'))
        : reporter.error(reporter.lang('createdTagFail'));

      reporter.step(3, 3, reporter.lang('revokingToken'));
      await revoke();

      if (result != null && result.ok) return true;
      throw new Error();
    },

    rm(config, reporter, flags, args) {
      reporter.warn('`yarn tag rm` is deprecated. Please use `yarn tag remove`.');
      return remove$1(config, reporter, flags, args).then(noop);
    },

    remove: (config, reporter, flags, args) => remove$1(config, reporter, flags, args).then(noop),

    ls(config, reporter, flags, args) {
      reporter.warn('`yarn tag ls` is deprecated. Please use `yarn tag list`.');
      return list$4(config, reporter, flags, args).then(noop);
    },

    list: (config, reporter, flags, args) => list$4(config, reporter, flags, args).then(noop),
  },
  ['add <pkg>@<version> [<tag>]', 'remove <pkg> <tag>', 'list [<pkg>]']
);

var tag = {
  __proto__: null,
  getName,
  setFlags: setFlags$t,
  run: run$u,
  hasWrapper: hasWrapper$t,
  examples: examples$5,
};

async function mutate(args, config, reporter, buildMessages, mutator) {
  if (args.length !== 2 && args.length !== 1) return false;

  const username = args.shift(),
    name = await getName(args, config);
  if (!isValidPackageName(name)) throw new MessageError(reporter.lang('invalidPackageName'));

  const msgs = buildMessages(username, name);
  reporter.step(1, 3, reporter.lang('loggingIn'));
  const revoke = await getToken(config, reporter, name);

  reporter.step(2, 3, msgs.info);
  const user = await config.registries.npm.request('-/user/org.couchdb.user:' + username);
  let error = false;
  if (user) {
    const pkg = await config.registries.npm.request(NpmRegistry.escapeName(name));
    if (pkg) {
      pkg.maintainers = pkg.maintainers || [];
      error = mutator({name: user.name, email: user.email}, pkg);
    } else {
      error = true;
      reporter.error(reporter.lang('unknownPackage', name));
    }

    if (pkg && !error) {
      const res = await config.registries.npm.request(`${NpmRegistry.escapeName(name)}/-rev/${pkg._rev}`, {
        method: 'PUT',
        body: {_id: pkg._id, _rev: pkg._rev, maintainers: pkg.maintainers},
      });

      if (res != null && res.success) reporter.success(msgs.success);
      else {
        error = true;
        reporter.error(msgs.error);
      }
    }
  } else {
    error = true;
    reporter.error(reporter.lang('unknownUser', username));
  }

  reporter.step(3, 3, reporter.lang('revokingToken'));
  await revoke();

  if (error) throw new Error();
  return true;
}

async function list$5(config, reporter, flags, args) {
  if (args.length > 1) return false;

  const name = await getName(args, config); // await
  reporter.step(1, 1, reporter.lang('ownerGetting', name));
  const pkg = await config.registries.npm.request(name, {unfiltered: true});
  if (pkg) {
    const owners = pkg.maintainers;
    if (owners && owners.length) for (const owner of owners) reporter.info(`${owner.name} <${owner.email}>`);
    else reporter.warn(reporter.lang('ownerNone'));
  } else reporter.error(reporter.lang('ownerGettingFailed'));

  if (pkg) return true;
  throw new Error();
}

function remove$2(config, reporter, flags, args) {
  return mutate(
    args,
    config,
    reporter,
    (username, name) => ({
      info: reporter.lang('ownerRemoving', username, name),
      success: reporter.lang('ownerRemoved'),
      error: reporter.lang('ownerRemoveError'),
    }),
    (user, pkg) => {
      let found = false;

      pkg.maintainers = pkg.maintainers.filter((o) => {
        const match = o.name === user.name;
        found = found || match;
        return !match;
      });

      found || reporter.error(reporter.lang('userNotAnOwner', user.name));

      return found;
    }
  );
}

function setFlags$u(commander) {
  commander.description('Manages package owners.');
}

const {run: run$v, hasWrapper: hasWrapper$u, examples: examples$6} = buildSubCommands(
  'owner',
  {
    add: (config, reporter, flags, args) =>
      mutate(
        args,
        config,
        reporter,
        (username, name) => ({
          info: reporter.lang('ownerAdding', username, name),
          success: reporter.lang('ownerAdded'),
          error: reporter.lang('ownerAddingFailed'),
        }),
        (user, pkg) => {
          for (const owner of pkg.maintainers)
            if (owner.name === user) {
              reporter.error(reporter.lang('ownerAlready'));
              return true;
            }

          pkg.maintainers.push(user);

          return false;
        }
      ),

    rm(config, reporter, flags, args) {
      reporter.warn('`yarn owner rm` is deprecated. Please use `yarn owner remove`.');
      return remove$2(config, reporter, flags, args);
    },

    remove: remove$2,

    ls(config, reporter, flags, args) {
      reporter.warn('`yarn owner ls` is deprecated. Please use `yarn owner list`.');
      return list$5(config, reporter, flags, args);
    },

    list: list$5,
  },
  ['add <user> [[<@scope>/]<pkg>]', 'remove <user> [[<@scope>/]<pkg>]', 'list [<@scope>/]<pkg>']
);

var owner = {
  __proto__: null,
  mutate,
  setFlags: setFlags$u,
  run: run$v,
  hasWrapper: hasWrapper$u,
  examples: examples$6,
};

const etc = '/etc',
  isWin = process.platform === 'win32',
  home$1 = isWin ? process.env.USERPROFILE : process.env.HOME;

function getRcPaths(name, cwd) {
  const configPaths = [];

  function pushConfigPath(...segments) {
    configPaths.push(path.join(...segments));
    segments[segments.length - 1] !== `.${name}rc` ||
      configPaths.push(path.join(...segments.slice(0, -1), `.${name}rc.yml`));
  }

  function unshiftConfigPath(...segments) {
    segments[segments.length - 1] !== `.${name}rc` ||
      configPaths.unshift(path.join(...segments.slice(0, -1), `.${name}rc.yml`));

    configPaths.unshift(path.join(...segments));
  }

  if (!isWin) {
    pushConfigPath(etc, name, 'config');
    pushConfigPath(etc, name + 'rc');
  }

  if (home$1) {
    pushConfigPath(CONFIG_DIRECTORY);
    pushConfigPath(home$1, '.config', name, 'config');
    pushConfigPath(home$1, '.config', name);
    pushConfigPath(home$1, '.' + name, 'config');
    pushConfigPath(home$1, `.${name}rc`);
  }

  while (1) {
    unshiftConfigPath(cwd, `.${name}rc`);

    const upperCwd = path.dirname(cwd);
    if (upperCwd === cwd) break;

    cwd = upperCwd;
  }

  const envVariable = `${name}_config`.toUpperCase();

  process.env[envVariable] && pushConfigPath(process.env[envVariable]);

  return configPaths;
}

function parseRcPaths(paths, parser) {
  return /*.apply(Object, [{}].concat())*/ Object.assign(
    {},
    ...paths.map(path => {
      try {
        return parser(fs.readFileSync(path).toString(), path);
      } catch (error) {
        if (error.code === 'ENOENT' || error.code === 'EISDIR') return {};

        throw error;
      }
    })
  );
}

function findRc(name, cwd, parser) {
  return parseRcPaths(getRcPaths(name, cwd), parser);
}

const PATH_KEYS = new Set([
  'yarn-path',
  'cache-folder',
  'global-folder',
  'modules-folder',
  'cwd',
  'offline-cache-folder',
]);

function getRcConfigForCwd(cwd, args) {
  const config = {};

  args.indexOf('--no-default-rc') < 0 &&
    Object.assign(
      config,
      findRc('yarn', cwd, (fileText, filePath) => loadRcFile(fileText, filePath))
    );

  for (let index = args.indexOf('--use-yarnrc'); index > -1; index = args.indexOf('--use-yarnrc', index + 1)) {
    const value = args[index + 1];

    value && value.charAt(0) !== '-' && Object.assign(config, loadRcFile(fs.readFileSync(value, 'utf8'), value));
  }

  return config;
}

function getRcConfigForFolder(cwd) {
  const filePath = path.resolve(cwd, '.yarnrc');
  return fs.existsSync(filePath) ? loadRcFile(fs.readFileSync(filePath, 'utf8'), filePath) : {};
}

function loadRcFile(fileText, filePath) {
  let {object: values} = Lockfile.parse(fileText, filePath);

  if (filePath.match(/\.yml$/) && typeof values.yarnPath == 'string') values = {'yarn-path': values.yarnPath};

  for (const key in values)
    if (PATH_KEYS.has(key.replace(/^(--)?([^.]+\.)*/, '')))
      values[key] = path.resolve(path.dirname(filePath), values[key]);

  return values;
}

function buildRcArgs(cwd, args) {
  const config = getRcConfigForCwd(cwd, args),

    argsForCommands = new Map();

  for (const key in config) {
    const keyMatch = key.match(/^--(?:([^.]+)\.)?(.*)$/);
    if (!keyMatch) continue;

    const commandName = keyMatch[1] || '*',
      arg = keyMatch[2],
      value = config[key],

      args = argsForCommands.get(commandName) || [];
    argsForCommands.set(commandName, args);

    const option = commander.optionFor('--' + arg);

    !option || option.optional || option.required
      ? args.push('--' + arg, value)
      : value !== true || args.push('--' + arg);
  }

  return argsForCommands;
}

function extractCwdArg(args) {
  for (let i = 0, I = args.length; i < I; ++i) {
    const arg = args[i];
    if (arg === '--') return null;
    if (arg === '--cwd') return args[i + 1];
  }
  return null;
}

function getRcArgs(commandName, args, previousCwds = []) {
  const origCwd = extractCwdArg(args) || process.cwd(),

    argMap = buildRcArgs(origCwd, args),

    newArgs = [...(argMap.get('*') || []), ...(argMap.get(commandName) || [])],

    newCwd = extractCwdArg(newArgs);
  if (newCwd && newCwd !== origCwd) {
    if (previousCwds.indexOf(newCwd) > -1)
      throw new Error('Recursive .yarnrc files specifying --cwd flags. Bailing out.');

    return getRcArgs(commandName, newArgs, previousCwds.concat(origCwd));
  }

  return newArgs;
}

const V2_NAMES = ['berry', 'stable', 'canary', 'v2', '2'],

  isLocalFile = (version) => version.match(/^\.{0,2}[\\/]/) || path.isAbsolute(version),
  isV2Version = (version) => satisfiesWithPrereleases(version, '>=2.0.0');

function getBundleAsset(release) {
  return release.assets.find(asset => asset.name.match(/^yarn-\d+\.\d+\.\d+\.js$/));
}

function fetchReleases(config, {includePrereleases = false} = {}) {
  const token = process.env.GITHUB_TOKEN,
    tokenUrlParameter = token ? '?access_token=' + token : '';

  return config.requestManager.request({
    url: 'https://api.github.com/repos/yarnpkg/yarn/releases' + tokenUrlParameter,
    json: true,
  }).then(request => {
    const releases = request.filter(release => {
      if (release.draft || (release.prerelease && !includePrereleases)) return false;

      release.version = semver.coerce(release.tag_name);

      return !!release.version && !!getBundleAsset(release);
    });

    releases.sort((a, b) => -semver.compare(a.version, b.version));

    return releases;
  });
}

function fetchBundle(config, url) {
  return config.requestManager.request({url, buffer: true});
}

function hasWrapper$v(flags, args) {
  return false;
}

const {run: run$w, setFlags: setFlags$v, examples: examples$7} = buildSubCommands('policies', {
  async setVersion(config, reporter, flags, args) {
    const initialRange = args[0] || 'latest';
    let range = initialRange,

      allowRc = flags.rc;

    if (range === 'rc') {
      reporter.log(
        `${chalk.yellow(
          'Warning:'
        )} Your current Yarn binary is currently Yarn ${version}; to avoid potential breaking changes, 'set version rc' won't receive upgrades past the 1.22.x branch.
         To upgrade to the latest versions, run ${chalk.cyan('yarn set version')} ${chalk.yellow.underline(
          'canary'
        )} instead. Sorry for the inconvenience.\n`
      );

      range = '*';
      allowRc = true;
    }

    if (range === 'latest') {
      reporter.log(
        `${chalk.yellow(
          'Warning:'
        )} Your current Yarn binary is currently Yarn ${version}; to avoid potential breaking changes, 'set version latest' won't receive upgrades past the 1.22.x branch.
         To upgrade to the latest versions, run ${chalk.cyan('yarn set version')} ${chalk.yellow.underline(
          'stable'
        )} instead. Sorry for the inconvenience.\n`
      );

      range = '*';
    }

    if (range === 'classic') range = '*';

    let bundleUrl, bundleVersion;

    if (range === 'nightly' || range === 'nightlies') {
      reporter.log(
        chalk.yellow('Warning:') +
          " Nightlies only exist for Yarn 1.x; starting from 2.x onwards, you should use 'canary' instead"
      );

      bundleUrl = 'https://nightly.yarnpkg.com/latest.js';
      bundleVersion = 'nightly';
    } else if (V2_NAMES.indexOf(range) >= 0 || isLocalFile(range) || isV2Version(range)) {
      const normalizedRange = range === 'canary' ? 'canary' : 'stable';

      if (process.env.COREPACK_ROOT) {
        await spawn(
          NODE_BIN_PATH,
          [
            path.join(process.env.COREPACK_ROOT, 'dist/corepack.js'),
            'yarn@' + normalizedRange,
            'set',
            'version',
            normalizedRange,
          ],
          {stdio: 'inherit', cwd: config.cwd}
        );

        return;
      }
      //{
      const bundle = await fetchBundle(
        config,
        'https://github.com/yarnpkg/berry/raw/master/packages/yarnpkg-cli/bin/yarn.js'
      );

      const yarnPath = path.resolve(config.lockfileFolder, '.yarn/releases/yarn-stable-temp.cjs');
      await mkdirp(path.dirname(yarnPath));
      await writeFile(yarnPath, bundle);
      await chmod(yarnPath, 0o755);

      try {
        await spawn(NODE_BIN_PATH, [yarnPath, 'set', 'version', range], {
          stdio: 'inherit',
          cwd: config.lockfileFolder,
          env: {...process.env, YARN_IGNORE_PATH: '1'},
        });
      } catch (_err) {
        process.exit(1);
      }

      return;
      //}
    } else {
      reporter.log(`Resolving ${chalk.yellow(initialRange)} to a url...`);

      let releases = [];
      try {
        releases = await fetchReleases(config, {includePrereleases: allowRc});
      } catch (e) {
        reporter.error(e.message);
        return;
      }

      const release = releases.find(release => semver.satisfies(release.version, range));

      if (!release) throw new Error('Release not found: ' + range);

      const asset = getBundleAsset(release);
      invariant(asset, 'The bundle asset should exist');

      bundleUrl = asset.browser_download_url;
      bundleVersion = release.version.version;
    }

    reporter.log(`Downloading ${chalk.green(bundleUrl)}...`);

    const bundle = await fetchBundle(config, bundleUrl),

      yarnPath = path.resolve(config.lockfileFolder, `.yarn/releases/yarn-${bundleVersion}.cjs`);
    reporter.log(`Saving it into ${chalk.magenta(yarnPath)}...`);
    await mkdirp(path.dirname(yarnPath));
    await writeFile(yarnPath, bundle);
    await chmod(yarnPath, 0o755);

    const targetPath = path.relative(config.lockfileFolder, yarnPath).replace(/\\/g, '/');
    //{
    const rcPath = config.lockfileFolder + '/.yarnrc';
    reporter.log(`Updating ${chalk.magenta(rcPath)}...`);

    const rc = getRcConfigForFolder(config.lockfileFolder);
    rc['yarn-path'] = targetPath;

    await writeFilePreservingEol(rcPath, Lockfile.stringify(rc) + '\n');
    //}

    reporter.log('Done!');
  },
});

var policies = {
  __proto__: null,
  hasWrapper: hasWrapper$v,
  run: run$w,
  setFlags: setFlags$v,
  examples: examples$7,
};

const NEW_VERSION_FLAG = '--new-version [version]';
function isValidNewVersion(oldVersion, newVersion, looseSemver, identifier) {
  return !(!semver.valid(newVersion, looseSemver) && !semver.inc(oldVersion, newVersion, looseSemver, identifier));
}

function setFlags$w(commander) {
  commander.description('Update the version of your package via the command line.');
  commander.option(NEW_VERSION_FLAG, 'new version');
  commander.option('--major', 'auto-increment major version number');
  commander.option('--minor', 'auto-increment minor version number');
  commander.option('--patch', 'auto-increment patch version number');
  commander.option('--premajor', 'auto-increment premajor version number');
  commander.option('--preminor', 'auto-increment preminor version number');
  commander.option('--prepatch', 'auto-increment prepatch version number');
  commander.option('--prerelease', 'auto-increment prerelease version number');
  commander.option('--preid [preid]', 'add a custom identifier to the prerelease');
  commander.option('--message [message]', 'message');
  commander.option('--no-git-tag-version', 'no git tag version');
  commander.option('--no-commit-hooks', 'bypass git hooks when committing new version');
}

function hasWrapper$w(commander, args) {
  return true;
}

async function setVersion(config, reporter, flags, args, required) {
  const pkg = await config.readRootManifest(),
    pkgLoc = pkg._loc,
    scripts = nullify();
  let newVersion = flags.newVersion,
    identifier = void 0;
  if (flags.preid) identifier = flags.preid;

  invariant(pkgLoc, 'expected package location');

  if (args.length && !newVersion) throw new MessageError(reporter.lang('invalidVersionArgument', NEW_VERSION_FLAG));

  function runLifecycle(lifecycle) {
    return scripts[lifecycle]
      ? execCommand({stage: lifecycle, config, cmd: scripts[lifecycle], cwd: config.cwd, isInteractive: true})
      : Promise.resolve();
  }

  function isCommitHooksDisabled() {
    return flags.commitHooks === false || config.getOption('version-commit-hooks') === false;
  }

  pkg.scripts && Object.assign(scripts, pkg.scripts);

  let oldVersion = pkg.version;
  oldVersion ? reporter.info(`${reporter.lang('currentVersion')}: ${oldVersion}`) : (oldVersion = '0.0.0');

  if (newVersion && !isValidNewVersion(oldVersion, newVersion, config.looseSemver, identifier))
    throw new MessageError(reporter.lang('invalidVersion'));

  if (!newVersion)
    if (flags.major) newVersion = semver.inc(oldVersion, 'major');
    else if (flags.minor) newVersion = semver.inc(oldVersion, 'minor');
    else if (flags.patch) newVersion = semver.inc(oldVersion, 'patch');
    else if (flags.premajor) newVersion = semver.inc(oldVersion, 'premajor', identifier);
    else if (flags.preminor) newVersion = semver.inc(oldVersion, 'preminor', identifier);
    else if (flags.prepatch) newVersion = semver.inc(oldVersion, 'prepatch', identifier);
    else if (flags.prerelease) newVersion = semver.inc(oldVersion, 'prerelease', identifier);

  while (!newVersion) {
    if (flags.nonInteractive || config.nonInteractive) {
      newVersion = oldVersion;
      break;
    }

    try {
      newVersion = await reporter.question(reporter.lang('newVersion'));
      newVersion || (newVersion = oldVersion);
    } catch (_err) {
      newVersion = oldVersion;
    }

    if (!required && !newVersion) {
      reporter.info(`${reporter.lang('noVersionOnPublish')}: ${oldVersion}`);
      return function() {
        return Promise.resolve();
      };
    }

    if (isValidNewVersion(oldVersion, newVersion, config.looseSemver, identifier)) break;

    newVersion = null;
    reporter.error(reporter.lang('invalidSemver'));
  }
  if (newVersion) newVersion = semver.inc(oldVersion, newVersion, config.looseSemver, identifier) || newVersion;

  invariant(newVersion, 'expected new version');

  if (newVersion === pkg.version)
    return function() {
      return Promise.resolve();
    };

  await runLifecycle('preversion');

  reporter.info(`${reporter.lang('newVersion')}: ${newVersion}`);
  pkg.version = newVersion;

  const manifests = await config.getRootManifests();
  for (const registryName of registryNames) {
    const manifest = manifests[registryName];
    if (manifest.exists) manifest.object.version = newVersion;
  }
  await config.saveRootManifests(manifests);

  await runLifecycle('version');

  return async function() {
    invariant(newVersion, 'expected version');

    if (flags.gitTagVersion && config.getOption('version-git-tag')) {
      let isGit = false;
      for (const parts = config.cwd.split(path.sep); parts.length; ) {
        isGit = await exists(path.join(parts.join(path.sep), '.git'));
        if (isGit) break;

        parts.pop();
      }

      if (isGit) {
        const message = (flags.message || String(config.getOption('version-git-message'))).replace(/%s/g, newVersion),
          flag = Boolean(config.getOption('version-sign-git-tag')) ? '-sm' : '-am',
          prefix = String(config.getOption('version-tag-prefix')),
          args = ['commit', '-m', message, ...(isCommitHooksDisabled() ? ['-n'] : [])],

          gitRoot = (await spawn$1(['rev-parse', '--show-toplevel'], {cwd: config.cwd})).trim();

        await spawn$1(['add', path.relative(gitRoot, pkgLoc)], {cwd: gitRoot});
        await spawn$1(args, {cwd: gitRoot});

        await spawn$1(['tag', `${prefix}${newVersion}`, flag, message], {cwd: gitRoot});
      }
    }

    await runLifecycle('postversion');
  };
}

function run$x(config, reporter, flags, args) {
  return setVersion(config, reporter, flags, args, true).then(commit => commit().then(noop));
}

var version$1 = {
  __proto__: null,
  setFlags: setFlags$w,
  hasWrapper: hasWrapper$w,
  setVersion,
  run: run$x,
};

function setFlags$x(commander) {
  setFlags$w(commander);
  commander.description('Publishes a package to the npm registry.');
  commander.usage('publish [<tarball>|<folder>] [--tag <tag>] [--access <public|restricted>]');
  commander.option('--access [access]', 'access');
  commander.option('--tag [tag]', 'tag');
}

function hasWrapper$x(commander, args) {
  return true;
}

async function publish(config, pkg, flags, dir) {
  let access = flags.access;

  if (!access && pkg && pkg.publishConfig && pkg.publishConfig.access) access = pkg.publishConfig.access;

  if (access && access !== 'public' && access !== 'restricted')
    throw new MessageError(config.reporter.lang('invalidAccess'));

  await config.executeLifecycleScript('prepublish');
  await config.executeLifecycleScript('prepare');
  await config.executeLifecycleScript('prepublishOnly');
  await config.executeLifecycleScript('prepack');

  const stat = await lstat$1(dir);
  let stream;
  if (stat.isDirectory()) stream = await pack(config);
  else if (stat.isFile()) stream = fs.createReadStream(dir);
  else throw new Error("Don't know how to handle this file type");

  const buffer = await new Promise((resolve, reject) => {
    const data = [];
    invariant(stream, 'expected stream');
    stream
      .on('data', data.push.bind(data))
      .on('end', () => resolve(Buffer.concat(data)))
      .on('error', reject);
  });

  await config.executeLifecycleScript('postpack');

  pkg = Object.assign({}, pkg);
  for (const key in pkg) key[0] !== '_' || delete pkg[key];

  const tag = flags.tag || 'latest',
    tbName = `${pkg.name}-${pkg.version}.tgz`,
    tbURI = `${pkg.name}/-/${tbName}`;

  const root = {
    _id: pkg.name,
    access,
    name: pkg.name,
    description: pkg.description,
    'dist-tags': {[tag]: pkg.version},
    versions: {[pkg.version]: pkg},
    readme: pkg.readme || '',
    _attachments: {
      [tbName]: {content_type: 'application/octet-stream', data: buffer.toString('base64'), length: buffer.length},
    },
  };

  pkg._id = `${pkg.name}@${pkg.version}`;
  pkg.dist = pkg.dist || {};
  pkg.dist.shasum = crypto.createHash('sha1').update(buffer).digest('hex');
  pkg.dist.integrity = ssri.fromData(buffer).toString();

  const registry = String(config.getOption('registry'));
  pkg.dist.tarball = url.resolve(registry, tbURI).replace(/^https:\/\//, 'http://');

  try {
    await config.registries.npm.request(NpmRegistry.escapeName(pkg.name), {
      registry: pkg && pkg.publishConfig && pkg.publishConfig.registry,
      method: 'PUT',
      body: root,
    });
  } catch (error) {
    throw new MessageError(config.reporter.lang('publishFail', error.message));
  }

  await config.executeLifecycleScript('publish');
  await config.executeLifecycleScript('postpublish');
}

async function run$y(config, reporter, flags, args) {
  const dir = args[0] ? path.resolve(config.cwd, args[0]) : config.cwd;
  if (args.length > 1) throw new MessageError(reporter.lang('tooManyArguments', 1));

  if (!(await exists(dir))) throw new MessageError(reporter.lang('unknownFolderOrTarball'));

  let publishPath = dir;
  if ((await lstat$1(dir)).isDirectory()) {
    config.cwd = path.resolve(dir);
    publishPath = config.cwd;
  }

  const pkg = await config.readRootManifest();
  if (pkg.private) throw new MessageError(reporter.lang('publishPrivate'));
  if (!pkg.name) throw new MessageError(reporter.lang('noName'));

  let registry = '';
  if (pkg && pkg.publishConfig && pkg.publishConfig.registry) registry = pkg.publishConfig.registry;

  reporter.step(1, 4, reporter.lang('bumpingVersion'));
  const commitVersion = await setVersion(config, reporter, flags, [], false);

  reporter.step(2, 4, reporter.lang('loggingIn'));
  const revoke = await getToken(config, reporter, pkg.name, flags, registry);

  reporter.step(3, 4, reporter.lang('publishing'));
  await publish(config, pkg, flags, publishPath);
  await commitVersion();
  reporter.success(reporter.lang('published'));

  reporter.step(4, 4, reporter.lang('revokingToken'));
  await revoke();
}

var publish$1 = {
  __proto__: null,
  setFlags: setFlags$x,
  hasWrapper: hasWrapper$x,
  run: run$y,
};

function explodeScopeTeam(arg, requireTeam, reporter) {
  const [scope, team, ...parts] = arg.split(':');

  return !parts.length && !(requireTeam && !team) && {scope: scope || '', team: team || '', user: ''};
}

function warnDeprecation(reporter, deprecationWarning) {
  const command = 'yarn team';
  reporter.warn(
    reporter.lang(
      'deprecatedCommand',
      `${command} ${deprecationWarning.deprecatedCommand}`,
      `${command} ${deprecationWarning.currentCommand}`
    )
  );
}

function wrapRequired(callback, requireTeam, deprecationInfo) {
  return async function(config, reporter, flags, args) {
    deprecationInfo && warnDeprecation(reporter, deprecationInfo);

    if (!args.length) return false;

    const parts = explodeScopeTeam(args[0], requireTeam);
    if (!parts) return false;

    reporter.step(1, 3, reporter.lang('loggingIn'));
    const revoke = await getToken(config, reporter),

      res = await callback(parts, config, reporter, flags, args);
    if (!res) return res;

    reporter.step(3, 3, reporter.lang('revokingToken'));
    await revoke();
    return true;
  };
}

function wrapRequiredTeam(callback, requireTeam = true, subCommandDeprecated) {
  return wrapRequired(
    function(parts, config, reporter, flags, args) {
      return args.length === 1 && callback(parts, config, reporter, flags, args);
    },
    requireTeam,
    subCommandDeprecated
  );
}

function wrapRequiredUser(callback, subCommandDeprecated) {
  return wrapRequired(
    function(parts, config, reporter, flags, args) {
      return args.length === 2 && callback({user: args[1], ...parts}, config, reporter, flags, args);
    },
    true,
    subCommandDeprecated
  );
}

function removeTeamUser(parts, config, reporter) {
  reporter.step(2, 3, reporter.lang('teamRemovingUser'));
  return config.registries.npm.request(`team/${parts.scope}/${parts.team}/user`, {
    method: 'DELETE',
    body: {user: parts.user},
  }).then(res => {
    reporter.inspect(res);
    return true;
  });
}

function list$6(parts, config, reporter) {
  reporter.step(2, 3, reporter.lang('teamListing'));
  const uriParams = '?format=cli';
  return config.registries.npm.request(
    parts.team ? `team/${parts.scope}/${parts.team}/user${uriParams}` : `org/${parts.scope}/team${uriParams}`
  ).then(res => {
    reporter.inspect(res);

    return true;
  });
}

function setFlags$y(commander) {
  commander.description('Maintain team memberships');
}

const {run: run$z, hasWrapper: hasWrapper$y, examples: examples$8} = buildSubCommands(
  'team',
  {
    create: wrapRequiredTeam(function(parts, config, reporter, flags, args) {
      reporter.step(2, 3, reporter.lang('teamCreating'));
      return config.registries.npm.request('team/' + parts.scope, {
        method: 'PUT',
        body: {team: parts.team},
      }).then(res => {
        reporter.inspect(res);
        return true;
      });
    }),

    destroy: wrapRequiredTeam(function(parts, config, reporter, flags, args) {
      reporter.step(2, 3, reporter.lang('teamRemoving'));
      return config.registries.npm.request(`team/${parts.scope}/${parts.team}`, {method: 'DELETE'}).then(res => {
        reporter.inspect(res);
        return true;
      });
    }),

    add: wrapRequiredUser(function(parts, config, reporter, flags, args) {
      reporter.step(2, 3, reporter.lang('teamAddingUser'));
      return config.registries.npm.request(`team/${parts.scope}/${parts.team}/user`, {
        method: 'PUT',
        body: {user: parts.user},
      }).then(res => {
        reporter.inspect(res);
        return true;
      });
    }),

    rm: wrapRequiredUser((parts, config, reporter, flags, args) => removeTeamUser(parts, config, reporter).then(noop), {
      deprecatedCommand: 'rm',
      currentCommand: 'remove',
    }),

    remove: wrapRequiredUser((parts, config, reporter, flags, args) =>
      removeTeamUser(parts, config, reporter).then(noop)
    ),

    ls: wrapRequiredTeam((parts, config, reporter, flags, args) => list$6(parts, config, reporter).then(noop), false, {
      deprecatedCommand: 'ls',
      currentCommand: 'list',
    }),

    list: wrapRequiredTeam((parts, config, reporter, flags, args) => list$6(parts, config, reporter).then(noop), false),
  },
  [
    'create <scope:team>',
    'destroy <scope:team>',
    'add <scope:team> <user>',
    'remove <scope:team> <user>',
    'list <scope>|<scope:team>',
  ]
);

var team = {
  __proto__: null,
  setFlags: setFlags$y,
  run: run$z,
  hasWrapper: hasWrapper$y,
  examples: examples$8,
};

function hasWrapper$z(commander) {
  return true;
}

function setFlags$z(commander) {
  commander.description(
    'Temporarily copies a package (with an optional @range suffix) outside of the global cache for debugging purposes'
  );
  commander.usage('unplug [packages ...] [flags]');
  commander.option('--clear', 'Delete the selected packages');
  commander.option('--clear-all', 'Delete all unplugged packages');
}

async function run$A(config, reporter, flags, args) {
  if (!config.plugnplayEnabled) throw new MessageError(reporter.lang('unplugDisabled'));
  if (!args.length && flags.clear) throw new MessageError(reporter.lang('tooFewArguments', 1));
  if (args.length && flags.clearAll) throw new MessageError(reporter.lang('noArguments'));

  if (flags.clearAll) await clearAll(config);
  else if (flags.clear) await clearSome(config, new Set(args));
  else if (args.length > 0) {
    const lockfile = await Lockfile.fromDirectory(config.lockfileFolder, reporter);
    await wrapLifecycle(config, flags, () => {
      const install = new Install(flags, config, reporter, lockfile);
      install.linker.unplugged = args;
      return install.init().then(noop);
    });
  }

  const unpluggedPackageFolders = await config.listUnpluggedPackageFolders();

  for (const target of unpluggedPackageFolders.values()) reporter.log(target, {force: true});
}

async function clearSome(config, filters) {
  const unpluggedPackageFolders = await config.listUnpluggedPackageFolders(),
    removeList = [];

  for (const [unpluggedName, target] of unpluggedPackageFolders.entries()) {
    const {name} = await readJson(path.join(target, 'package.json'));

    filters.has(name) && removeList.push(path.join(config.getUnpluggedPath(), unpluggedName));
  }

  if (removeList.length === unpluggedPackageFolders.size) await unlink(config.getUnpluggedPath());
  else for (const unpluggedPackagePath of removeList) await unlink(unpluggedPackagePath);
}

function clearAll(config) {
  return unlink(config.getUnpluggedPath()).then(noop);
}

var unplug = {
  __proto__: null,
  hasWrapper: hasWrapper$z,
  setFlags: setFlags$z,
  run: run$A,
  clearSome,
  clearAll,
};

function setFlags$A(commander) {
  commander.description('Unlink a previously created symlink for a package.');
}

function hasWrapper$A(commander, args) {
  return true;
}

async function run$B(config, reporter, flags, args) {
  if (args.length)
    for (const name of args) {
      const linkLoc = path.join(config.linkFolder, name);
      if (!(await exists(linkLoc))) throw new MessageError(reporter.lang('linkMissing', name));

      await unlink(path.join(await getRegistryFolder(config, name), name));
      reporter.success(reporter.lang('linkDisusing', name));
      reporter.info(reporter.lang('linkDisusingMessage', name));
    }
  else {
    const manifest = await config.readRootManifest(),
      name = manifest.name;
    if (!name) throw new MessageError(reporter.lang('unknownPackageName'));

    const linkLoc = path.join(config.linkFolder, name);
    if (!(await exists(linkLoc))) throw new MessageError(reporter.lang('linkMissing', name));

    if (manifest.bin) {
      const globalBinFolder = await getBinFolder(config, flags);
      for (const binName in manifest.bin) {
        const binDestLoc = path.join(globalBinFolder, binName);
        if (await exists(binDestLoc)) {
          await unlink(binDestLoc);
          if (process.platform === 'win32') await unlink(binDestLoc + '.cmd');
        }
      }
    }

    await unlink(linkLoc);

    reporter.success(reporter.lang('linkUnregistered', name));
    reporter.info(reporter.lang('linkUnregisteredMessage', name));
  }
}

var unlink$1 = {
  __proto__: null,
  setFlags: setFlags$A,
  hasWrapper: hasWrapper$A,
  run: run$B,
};

function setFlags$B(commander) {
  commander.description('Displays version information of currently installed Yarn, Node.js, and its dependencies.');
}

function hasWrapper$B(commander, args) {
  return true;
}

function run$C(config, reporter, flags, args) {
  const versions = {yarn: version};

  return config.maybeReadManifest(config.cwd).then(pkg => {
    if (pkg && pkg.name && pkg.version) versions[pkg.name] = pkg.version;

    Object.assign(versions, process.versions);

    reporter.inspect(versions);
  });
}

var versions = {
  __proto__: null,
  setFlags: setFlags$B,
  hasWrapper: hasWrapper$B,
  run: run$C,
};

const requireLockfile$7 = true;

async function cleanQuery(config, query) {
  if (path.isAbsolute(query) && (await exists(query))) query = path.relative(config.cwd, query);

  let queryParts = (query = query.replace(/([\\/]|^)node_modules[\\/]/g, '#').replace(/^#+/g, '')).split('#'); //

  queryParts = queryParts.map((part) => {
    let parts = part.split(/[\\/]/g);

    parts = part[0] === '@' ? parts.slice(0, 2) : parts.slice(0, 1);

    return parts.join('/');
  });

  return queryParts.join('#');
}

function getPackageSize(tuple) {
  const [loc] = tuple;

  return walk(loc, null, new Set([METADATA_FILENAME, TARBALL_FILENAME])).then(files =>
    Promise.all(files.map(walkFile => getFileSizeOnDisk(walkFile.absolute))).then(sum)
  );
}

function sum(array) {
  return array.length ? array.reduce((a, b) => a + b, 0) : 0;
}

function collect(hoistManifests, allDependencies, dependency, {recursive} = {recursive: false}) {
  const [, depInfo] = dependency,
    deps = depInfo.pkg.dependencies;

  if (!deps) return allDependencies;

  const dependencyKeys = new Set(Object.keys(deps)),
    directDependencies = [];

  for (const dep of hoistManifests) {
    const [, info] = dep;

    if (!allDependencies.has(dep) && dependencyKeys.has(info.key)) {
      allDependencies.add(dep);
      directDependencies.push(dep);
    }
  }

  recursive &&
    directDependencies.forEach(dependency => collect(hoistManifests, allDependencies, dependency, {recursive: true}));

  return allDependencies;
}

function getSharedDependencies(hoistManifests, transitiveKeys) {
  const sharedDependencies = new Set();
  for (const [, info] of hoistManifests)
    transitiveKeys.has(info.key) || !info.pkg.dependencies ||
      Object.keys(info.pkg.dependencies).forEach(dependency => {
        !transitiveKeys.has(dependency) || sharedDependencies.has(dependency) || sharedDependencies.add(dependency);
      });

  return sharedDependencies;
}

function setFlags$C(commander) {
  commander.description('Identifies why a package has been installed, detailing which other packages depend on it.');
}

function hasWrapper$C(commander, args) {
  return true;
}

function toStandardPathString(pathString) {
  const str = pathString.replace(/\//g, '#');
  return str[0] === '#' ? str.slice(1) : str;
}

async function run$D(config, reporter, flags, args) {
  if (!args.length) throw new MessageError(reporter.lang('missingWhyDependency'));
  if (args.length > 1) throw new MessageError(reporter.lang('tooManyArguments', 1));

  const query = await cleanQuery(config, args[0]);

  reporter.step(1, 4, reporter.lang('whyStart', args[0]), emoji.get('thinking_face'));

  reporter.step(2, 4, reporter.lang('whyInitGraph'), emoji.get('truck'));
  const lockfile = await Lockfile.fromDirectory(config.lockfileFolder, reporter),
    install = new Install(flags, config, reporter, lockfile),
    {requests: depRequests, patterns, workspaceLayout} = await install.fetchRequestFromCwd();
  await install.resolver.init(depRequests, {
    isFlat: install.flags.flat,
    isFrozen: install.flags.frozenLockfile,
    workspaceLayout,
  });
  const hoisted = await install.linker.getFlatHoistedTree(patterns);

  reporter.step(3, 4, reporter.lang('whyFinding'), emoji.get('mag'));

  const matches = queryWhy(query, hoisted);

  if (matches.length <= 0) {
    reporter.error(reporter.lang('whyUnknownMatch'));
    return;
  }

  const processMatch = async (match) => {
    const [, matchInfo] = match,
      matchRef = matchInfo.pkg._reference;
    invariant(matchRef, 'expected reference');

    const distinctMatchPatterns = new Set(matchRef.patterns),
      reasons = [];

    matchInfo.originalParentPath.length > 0 &&
      reasons.push({
        type: 'whyDependedOn',
        typeSimple: 'whyDependedOnSimple',
        value: toStandardPathString(matchInfo.originalParentPath),
      });

    let rootType;
    for (const pattern of distinctMatchPatterns) {
      rootType = install.rootPatternsToOrigin[pattern];
      rootType && reasons.push({type: 'whySpecified', typeSimple: 'whySpecifiedSimple', value: rootType});
    }

    for (const path of matchInfo.previousPaths)
      reasons.push({type: 'whyHoistedFrom', typeSimple: 'whyHoistedFromSimple', value: toStandardPathString(path)});

    let packageSize = 0,
      directSizes = [],
      transitiveSizes = [];
    try {
      packageSize = await getPackageSize(match);
    } catch (_) {}

    const dependencies = Array.from(collect(hoisted, new Set(), match)),
      transitiveDependencies = Array.from(collect(hoisted, new Set(), match, {recursive: true}));

    try {
      directSizes = await Promise.all(dependencies.map(getPackageSize));
      transitiveSizes = await Promise.all(transitiveDependencies.map(getPackageSize));
    } catch (_) {}

    const transitiveKeys = new Set(transitiveDependencies.map(([, info]) => info.key)),
      sharedDependencies = getSharedDependencies(hoisted, transitiveKeys);

    reporter.info(reporter.lang('whyMatch', `${matchInfo.key}@${matchInfo.pkg.version}`));
    matchInfo.isNohoist
      ? reasons.push({type: 'whyNotHoisted', typeSimple: 'whyNotHoistedSimple', value: matchInfo.nohoistList})
      : query !== matchInfo.originalKey || reporter.info(reporter.lang('whyHoistedTo', matchInfo.key));

    if (reasons.length === 1) reporter.info(reporter.lang(reasons[0].typeSimple, reasons[0].value));
    else if (reasons.length > 1) {
      reporter.info(reporter.lang('whyReasons'));
      reporter.list('reasons', reasons.map(reason => reporter.lang(reason.type, reason.value)));
    } else reporter.error(reporter.lang('whyWhoKnows'));

    if (packageSize) {
      reporter.info(reporter.lang('whyDiskSizeWithout', bytes(packageSize)));

      reporter.info(reporter.lang('whyDiskSizeUnique', bytes(packageSize + sum(directSizes))));
      reporter.info(reporter.lang('whyDiskSizeTransitive', bytes(packageSize + sum(transitiveSizes))));

      reporter.info(reporter.lang('whySharedDependencies', sharedDependencies.size));
    }
  };

  reporter.step(4, 4, reporter.lang('whyCalculating'), emoji.get('aerial_tramway'));
  for (const match of matches) await processMatch(match);
}

function queryWhy(pattern, hoisted) {
  const nohoistPattern = '#' + pattern,
    found = [];
  for (const [loc, info] of hoisted)
    if (info.key === pattern || info.previousPaths.indexOf(pattern) >= 0 || info.key.endsWith(nohoistPattern))
      found.push([loc, info]);

  return found;
}

var why = {
  __proto__: null,
  requireLockfile: requireLockfile$7,
  setFlags: setFlags$C,
  hasWrapper: hasWrapper$C,
  run: run$D,
  queryWhy,
};

function hasWrapper$D(commander, args) {
  return true;
}

async function info$1(config, reporter, flags, args) {
  const {workspaceRootFolder} = config;

  if (!workspaceRootFolder) throw new MessageError(reporter.lang('workspaceRootNotFound', config.cwd));

  const manifest = await config.findManifest(workspaceRootFolder, false);
  invariant(manifest && manifest.workspaces, 'We must find a manifest with a "workspaces" property');

  const workspaces = await config.resolveWorkspaces(workspaceRootFolder, manifest),

    publicData = {};

  for (const workspaceName of Object.keys(workspaces)) {
    const {loc, manifest} = workspaces[workspaceName],

      workspaceDependencies = new Set(),
      mismatchedWorkspaceDependencies = new Set();

    for (const dependencyType of DEPENDENCY_TYPES)
      if (dependencyType !== 'peerDependencies')
        for (const dependencyName of Object.keys(manifest[dependencyType] || {}))
          if (Object.prototype.hasOwnProperty.call(workspaces, dependencyName)) {
            invariant(manifest && manifest[dependencyType], 'The request should exist');
            const requestedRange = manifest[dependencyType][dependencyName];
            semver.satisfies(workspaces[dependencyName].manifest.version, requestedRange)
              ? workspaceDependencies.add(dependencyName)
              : mismatchedWorkspaceDependencies.add(dependencyName);
          }

    publicData[workspaceName] = {
      location: path.relative(config.lockfileFolder, loc).replace(/\\/g, '/'),
      workspaceDependencies: Array.from(workspaceDependencies),
      mismatchedWorkspaceDependencies: Array.from(mismatchedWorkspaceDependencies),
    };
  }

  reporter.log(JSON.stringify(publicData, null, 2), {force: true});
}

async function runScript(config, reporter, flags, args) {
  const {workspaceRootFolder} = config;

  if (!workspaceRootFolder) throw new MessageError(reporter.lang('workspaceRootNotFound', config.cwd));

  const manifest = await config.findManifest(workspaceRootFolder, false);
  invariant(manifest && manifest.workspaces, 'We must find a manifest with a "workspaces" property');

  const workspaces = await config.resolveWorkspaces(workspaceRootFolder, manifest);

  //try {
  for (const workspaceName of Object.keys(workspaces)) {
    const {loc} = workspaces[workspaceName];
    reporter.log(`${os.EOL}> ${workspaceName}`);
    await spawn(NODE_BIN_PATH, [YARN_BIN_PATH, 'run', ...args], {stdio: 'inherit', cwd: loc});
  }
  //} catch (err) { throw err; }
}

const {run: run$E, setFlags: setFlags$D, examples: examples$9} = buildSubCommands('workspaces', {
  info: (config, reporter, flags, args) => info$1(config, reporter).then(noop),
  run: runScript, // .then(noop)
});

var workspaces = {
  __proto__: null,
  hasWrapper: hasWrapper$D,
  info: info$1,
  runScript,
  run: run$E,
  setFlags: setFlags$D,
  examples: examples$9,
};

function setFlags$E(commander) {}

function hasWrapper$E(commander, args) {
  return true;
}

async function run$F(config, reporter, flags, args) {
  const {workspaceRootFolder} = config;

  if (!workspaceRootFolder) throw new MessageError(reporter.lang('workspaceRootNotFound', config.cwd));

  if (args.length < 1) throw new MessageError(reporter.lang('workspaceMissingWorkspace'));

  if (args.length < 2) throw new MessageError(reporter.lang('workspaceMissingCommand'));

  const manifest = await config.findManifest(workspaceRootFolder, false);
  invariant(manifest && manifest.workspaces, 'We must find a manifest with a "workspaces" property');

  const workspaces = await config.resolveWorkspaces(workspaceRootFolder, manifest),
    [workspaceName, ...rest] = args || [];

  if (!Object.prototype.hasOwnProperty.call(workspaces, workspaceName))
    throw new MessageError(reporter.lang('workspaceUnknownWorkspace', workspaceName));

  const workspace = workspaces[workspaceName];

  //try {
  await spawn(NODE_BIN_PATH, [YARN_BIN_PATH, ...rest], {stdio: 'inherit', cwd: workspace.loc});
  //} catch (err) { throw err; }
}

var workspace = {
  __proto__: null,
  setFlags: setFlags$E,
  hasWrapper: hasWrapper$E,
  run: run$F,
};

function buildUseless(message) {
  return {
    useless: true,
    run() {
      throw new MessageError(message);
    },
    setFlags: () => {},
    hasWrapper: () => true,
  };
}

const getDocsLink = name => `${YARN_DOCS}${name || ''}`,
  getDocsInfo = name => 'Visit ' + chalk.bold(getDocsLink(name)) + ' for documentation about this command.';

const commands = {
  access: access$1,
  add,
  audit,
  autoclean,
  bin,
  cache,
  check: check$1,
  config,
  create,
  dedupe: buildUseless("The dedupe command isn't necessary. `yarn install` will already dedupe."),
  exec: exec$1,
  generateLockEntry,
  global: global$1,
  help,
  import: import_,
  info,
  init,
  install: install$1,
  licenses,
  link: link$1,
  lockfile: buildUseless("The lockfile command isn't necessary. `yarn install` will produce a lockfile."),
  login,
  logout,
  list: list$1,
  node,
  outdated,
  owner,
  pack: pack$1,
  policies,
  prune: buildUseless("The prune command isn't necessary. `yarn install` will prune extraneous packages."),
  publish: publish$1,
  remove,
  run: run$a,
  tag,
  team,
  unplug,
  unlink: unlink$1,
  upgrade,
  version: version$1,
  versions,
  why,
  workspaces,
  workspace,
  upgradeInteractive,
};

for (const key in commands) commands[key].getDocsInfo = getDocsInfo(key);

for (const key in aliases$1) {
  commands[key] = commands[aliases$1[key]];
  commands[key].getDocsInfo = getDocsInfo(key);
}

function forwardSignalAndExit(signal) {
  forwardSignalToSpawnedProcesses(signal);
  process.exit(1);
}

function handleSignals() {
  process.on('SIGTERM', () => {
    forwardSignalAndExit('SIGTERM');
  });
}

process.stdout[typeof process.stdout.prependListener == 'function' ? 'prependListener' : 'on']('error', err => {
  if (err.code !== 'EPIPE' && err.code !== 'ERR_STREAM_DESTROYED') throw err;
});

function findProjectRoot(base) {
  let prev = null,
    dir = base;

  do {
    if (fs.existsSync(path.join(dir, NODE_PACKAGE_JSON))) return dir;

    prev = dir;
    dir = path.dirname(dir);
  } while (dir !== prev);

  return base;
}

function main({startArgs, args, endArgs}) {
  const collect = (val, acc) => {
    acc.push(val);
    return acc;
  };

  loudRejection();
  handleSignals();

  commander.version(version, '-v, --version');
  commander.usage('[command] [flags]');
  commander.option('--no-default-rc', 'prevent Yarn from automatically detecting yarnrc and npmrc files');
  commander.option(
    '--use-yarnrc <path>',
    'specifies a yarnrc file that Yarn should use (.yarnrc only, not .npmrc)',
    collect,
    []
  );
  commander.option('--verbose', 'output verbose messages on internal operations');
  commander.option('--offline', 'trigger an error if any required dependencies are not available in local cache');
  commander.option('--prefer-offline', 'use network only if dependencies are not available in local cache');
  commander.option('--enable-pnp, --pnp', "enable the Plug'n'Play installation");
  commander.option('--disable-pnp', "disable the Plug'n'Play installation");
  commander.option('--strict-semver');
  commander.option('--json', 'format Yarn log messages as lines of JSON (see jsonlines.org)');
  commander.option('--ignore-scripts', "don't run lifecycle scripts");
  commander.option('--har', 'save HAR output of network traffic');
  commander.option('--ignore-platform', 'ignore platform checks');
  commander.option('--ignore-engines', 'ignore engines check');
  commander.option('--ignore-optional', 'ignore optional dependencies');
  commander.option('--force', 'install and build packages even if they were built before, overwrite lockfile');
  commander.option('--skip-integrity-check', 'run install without checking if node_modules is installed');
  commander.option('--check-files', 'install will verify file tree of packages for consistency');
  commander.option('--no-bin-links', "don't generate bin links when setting up packages");
  commander.option('--flat', 'only allow one version of a package');
  commander.option('--prod, --production [prod]', '', boolify);
  commander.option('--no-lockfile', "don't read or generate a lockfile");
  commander.option('--pure-lockfile', "don't generate a lockfile");
  commander.option('--frozen-lockfile', "don't generate a lockfile and fail if an update is needed");
  commander.option('--update-checksums', 'update package checksums from current repository');
  commander.option('--link-duplicates', 'create hardlinks to the repeated modules in node_modules');
  commander.option('--link-folder <path>', 'specify a custom folder to store global links');
  commander.option('--global-folder <path>', 'specify a custom folder to store global packages');
  commander.option(
    '--modules-folder <path>',
    'rather than installing modules into the node_modules folder relative to the cwd, output them here'
  );
  commander.option('--preferred-cache-folder <path>', 'specify a custom folder to store the yarn cache if possible');
  commander.option('--cache-folder <path>', 'specify a custom folder that must be used to store the yarn cache');
  commander.option('--mutex <type>[:specifier]', 'use a mutex to ensure only one yarn instance is executing');
  commander.option(
    '--emoji [bool]',
    'enable emoji in output',
    boolify,
    process.platform === 'darwin' ||
      process.env.TERM_PROGRAM === 'Hyper' ||
      process.env.TERM_PROGRAM === 'HyperTerm' ||
      process.env.TERM_PROGRAM === 'Terminus'
  );
  commander.option('-s, --silent', 'skip Yarn console logs, other types of logs (script output) will be printed');
  commander.option('--cwd <cwd>', 'working directory to use', process.cwd());
  commander.option('--proxy <host>', '');
  commander.option('--https-proxy <host>', '');
  commander.option('--registry <url>', 'override configuration registry');
  commander.option('--no-progress', 'disable progress bar');
  commander.option('--network-concurrency <number>', 'maximum number of concurrent network requests', parseInt);
  commander.option('--network-timeout <milliseconds>', 'TCP timeout for network requests', parseInt);
  commander.option('--non-interactive', 'do not show interactive prompts');
  commander.option(
    '--scripts-prepend-node-path [bool]',
    'prepend the node executable dir to the PATH in scripts',
    boolify
  );
  commander.option('--no-node-version-check', 'do not warn when using a potentially unsupported Node version');
  commander.option('--focus', 'Focus on a single workspace by installing remote copies of its sibling workspaces.');
  commander.option('--otp <otpcode>', 'one-time password for two factor authentication');
  commander.option('--package-date-limit <time>', 'only install package version that have release date before this');

  if (args[0] === '-v') {
    console.log(version.trim());
    process.exitCode = 0;
    return;
  }

  const firstNonFlagIndex = args.findIndex((arg, idx, arr) => {
    const isOption = arg.startsWith('-'),
      prev = idx > 0 && arr[idx - 1],
      prevOption = prev && prev.startsWith('-') && commander.optionFor(prev),
      boundToPrevOption = prevOption && (prevOption.optional || prevOption.required);

    return !isOption && !boundToPrevOption;
  });
  let preCommandArgs,
    commandName = '';
  if (firstNonFlagIndex > -1) {
    preCommandArgs = args.slice(0, firstNonFlagIndex);
    commandName = args[firstNonFlagIndex];
    args = args.slice(firstNonFlagIndex + 1);
  } else {
    preCommandArgs = args;
    args = [];
  }

  let isKnownCommand = Object.prototype.hasOwnProperty.call(commands, commandName);
  const isHelp = arg => arg === '--help' || arg === '-h',
    helpInPre = preCommandArgs.findIndex(isHelp),
    helpInArgs = args.findIndex(isHelp);
  const setHelpMode = () => {
    isKnownCommand && args.unshift(commandName);

    commandName = 'help';
    isKnownCommand = true;
  };

  if (helpInPre > -1) {
    preCommandArgs.splice(helpInPre);
    setHelpMode();
  } else if (isKnownCommand && helpInArgs === 0) {
    args.splice(helpInArgs);
    setHelpMode();
  }

  if (!commandName) {
    commandName = 'install';
    isKnownCommand = true;
  }
  if (commandName === 'set' && args[0] === 'version') {
    commandName = 'policies';
    args.splice(0, 1, 'set-version');
    isKnownCommand = true;
  }
  if (!isKnownCommand) {
    args.unshift(commandName);
    commandName = 'run';
  }
  const command = commands[commandName];

  let warnAboutRunDashDash = false;

  const PROXY_COMMANDS = {run: 1, create: 1, node: 0, workspaces: 1, workspace: 2};
  if (PROXY_COMMANDS.hasOwnProperty(commandName))
    if (endArgs.length === 0) {
      let preservedArgs = PROXY_COMMANDS[commandName];

      if (args[preservedArgs] === '--into') preservedArgs += 2;

      endArgs = ['--', ...args.splice(preservedArgs)];
    } else warnAboutRunDashDash = true;

  args = [...preCommandArgs, ...args];

  command.setFlags(commander);
  commander.parse([...startArgs, 'this-arg-will-get-stripped-later', ...getRcArgs(commandName, args), ...args]);
  commander.args = commander.args.concat(endArgs.slice(1));

  console.assert(commander.args.length >= 1);
  console.assert(commander.args[0] === 'this-arg-will-get-stripped-later');
  commander.args.shift();

  const reporter = new (commander.json ? JSONReporter : ConsoleReporter)({
    emoji: process.stdout.isTTY && commander.emoji,
    verbose: commander.verbose,
    noProgress: !commander.progress,
    isSilent: boolifyWithDefault(process.env.YARN_SILENT, false) || commander.silent,
    nonInteractive: commander.nonInteractive,
  });

  const exit = exitCode => {
    process.exitCode = exitCode || 0;
    reporter.close();
  };

  reporter.initPeakMemoryCounter();

  const config = new Config(reporter);
  const shouldWrapOutput =
    boolifyWithDefault(process.env.YARN_WRAP_OUTPUT, true) &&
    !commander.json &&
    command.hasWrapper(commander, commander.args) &&
    !(commandName === 'init' && commander[2]);

  shouldWrapOutput && reporter.header(commandName, {name: 'yarn', version});

  !commander.nodeVersionCheck || semver.satisfies(process.versions.node, SUPPORTED_NODE_VERSIONS) ||
    reporter.warn(reporter.lang('unsupportedNodeVersion', process.versions.node, SUPPORTED_NODE_VERSIONS));

  if (command.noArguments && commander.args.length) {
    reporter.error(reporter.lang('noArguments'));
    reporter.info(command.getDocsInfo);
    exit(1);
    return;
  }

  commander.yes && reporter.warn(reporter.lang('yesWarning'));

  commander.offline || !isOffline() || reporter.warn(reporter.lang('networkWarning'));

  const run = () => {
    invariant(command, 'missing command');

    warnAboutRunDashDash && reporter.warn(reporter.lang('dashDashDeprecation'));

    return command.run(config, reporter, commander, commander.args).then(exitCode => {
      shouldWrapOutput && reporter.footer(false);

      return exitCode;
    });
  };

  const runEventuallyWithFile = (mutexFilename, isFirstTime) =>
    new Promise(resolve => {
      const lockFilename = mutexFilename || path.join(config.cwd, SINGLE_INSTANCE_FILENAME);
      lockfile.lock(lockFilename, {realpath: false}, (err, release) => {
        if (err) {
          isFirstTime && reporter.warn(reporter.lang('waitingInstance'));

          setTimeout(() => {
            resolve(runEventuallyWithFile(mutexFilename, false));
          }, 200);
        } else {
          onDeath(() => {
            process.exitCode = 1;
          });
          resolve(run().then(() => new Promise(resolve => release(resolve)))); // TODO unwrap resolve
        }
      });
    });

  const runEventuallyWithNetwork = (mutexPort) =>
    new Promise((resolve, reject) => {
      const connectionOptions = {port: +mutexPort || SINGLE_INSTANCE_PORT, host: 'localhost'};

      function startServer() {
        const clients = new Set(),
          server = http.createServer(manager);

        server.unref();

        server.timeout = 0;

        server.on('error', () => {
          reportServerName();
        });

        server.on('connection', socket => {
          clients.add(socket);
          socket.on('close', () => {
            clients.delete(socket);
          });
        });

        server.listen(connectionOptions, () => {
          onDeath(killSockets);

          run().then(
            res => {
              killSockets();
              resolve(res);
            },
            err => {
              killSockets();
              reject(err);
            }
          );
        });

        function manager(request, response) {
          response.writeHead(200);
          response.end(JSON.stringify({cwd: config.cwd, pid: process.pid}));
        }

        function killSockets() {
          try {
            server.close();
          } catch (_err) {}

          for (const socket of clients)
            try {
              socket.destroy();
            } catch (_err) {}

          setTimeout(() => {
            console.error('Process stalled');
            if (process._getActiveHandles) {
              console.error('Active handles:');
              for (const handle of process._getActiveHandles()) console.error('  - ' + handle.constructor.name);
            }
            process.exit(1);
          }, 5000).unref();
        }
      }

      function reportServerName() {
        const request = http.get(connectionOptions, response => {
          const buffers = [];

          response.on('data', buffer => {
            buffers.push(buffer);
          });

          response.on('end', () => {
            try {
              const {cwd, pid} = JSON.parse(Buffer.concat(buffers).toString());
              reporter.warn(reporter.lang('waitingNamedInstance', pid, cwd));
            } catch (error) {
              reporter.verbose(error);
              reject(new Error(reporter.lang('mutexPortBusy', connectionOptions.port)));
              return;
            }
            waitForTheNetwork();
          });

          response.on('error', () => {
            startServer();
          });
        });

        request.on('error', () => {
          startServer();
        });
      }

      function waitForTheNetwork() {
        const socket = net.createConnection(connectionOptions);

        socket.on('error', () => {});

        socket.on('close', () => {
          startServer();
        });
      }

      startServer();
    });

  function onUnexpectedError(err) {
    function indent(str) {
      return '\n  ' + str.trim().split('\n').join('\n  ');
    }

    const log = [
      'Arguments: ' + indent(process.argv.join(' ')),
      'PATH: ' + indent(process.env.PATH || 'undefined'),
      'Yarn version: ' + indent(version),
      'Node version: ' + indent(process.versions.node),
      'Platform: ' + indent(process.platform + ' ' + process.arch),

      'Trace: ' + indent(err.stack),
    ];

    for (const registryName of registryNames) {
      const possibleLoc = path.join(config.cwd, registries[registryName].filename),
        manifest = fs.existsSync(possibleLoc) ? fs.readFileSync(possibleLoc, 'utf8') : 'No manifest';
      log.push(`${registryName} manifest: ${indent(manifest)}`);
    }

    const lockLoc = path.join(config.lockfileFolder || config.cwd, LOCKFILE_FILENAME),
      lockfile = fs.existsSync(lockLoc) ? fs.readFileSync(lockLoc, 'utf8') : 'No lockfile';
    log.push('Lockfile: ' + indent(lockfile));

    const errorReportLoc = writeErrorReport(log);

    reporter.error(reporter.lang('unexpectedError', err.message));

    errorReportLoc && reporter.info(reporter.lang('bugReport', errorReportLoc));
  }

  function writeErrorReport(log) {
    const errorReportLoc = config.enableMetaFolder
      ? path.join(config.cwd, META_FOLDER, 'yarn-error.log')
      : path.join(config.cwd, 'yarn-error.log');

    try {
      fs.writeFileSync(errorReportLoc, log.join('\n\n') + '\n');
    } catch (err) {
      reporter.error(reporter.lang('fileWriteError', errorReportLoc, err.message));
      return void 0;
    }

    return errorReportLoc;
  }

  const cwd = command.shouldRunInCurrentCwd ? commander.cwd : findProjectRoot(commander.cwd),

    resolvedFolderOptions = {};
  ['linkFolder', 'globalFolder', 'preferredCacheFolder', 'cacheFolder', 'modulesFolder'].forEach(folderOptionKey => {
    const folderOption = commander[folderOptionKey],
      resolvedFolderOption = folderOption ? path.resolve(commander.cwd, folderOption) : folderOption;
    resolvedFolderOptions[folderOptionKey] = resolvedFolderOption;
  });

  return config
    .init({
      cwd,
      commandName,
      ...resolvedFolderOptions,
      enablePnp: commander.pnp,
      disablePnp: commander.disablePnp,
      enableDefaultRc: commander.defaultRc,
      extraneousYarnrcFiles: commander.useYarnrc,
      binLinks: commander.binLinks,
      preferOffline: commander.preferOffline,
      captureHar: commander.har,
      ignorePlatform: commander.ignorePlatform,
      ignoreEngines: commander.ignoreEngines,
      ignoreScripts: commander.ignoreScripts,
      offline: commander.preferOffline || commander.offline,
      looseSemver: !commander.strictSemver,
      production: commander.production,
      httpProxy: commander.proxy,
      httpsProxy: commander.httpsProxy,
      registry: commander.registry,
      networkConcurrency: commander.networkConcurrency,
      networkTimeout: commander.networkTimeout,
      nonInteractive: commander.nonInteractive,
      updateChecksums: commander.updateChecksums,
      focus: commander.focus,
      otp: commander.otp,
      packageDateLimit: commander.packageDateLimit,
    })
    .then(() => {
      if (command.requireLockfile && !fs.existsSync(path.join(config.lockfileFolder, LOCKFILE_FILENAME)))
        throw new MessageError(reporter.lang('noRequiredLockfile'));

      config.registries.yarn.getOption('no-progress') && reporter.disableProgress();

      reporter.verbose('current time: ' + new Date().toISOString());

      const mutex = commander.mutex;
      if (mutex && typeof mutex == 'string') {
        const separatorLoc = mutex.indexOf(':');
        let mutexType, mutexSpecifier;
        if (separatorLoc < 0) {
          mutexType = mutex;
          mutexSpecifier = void 0;
        } else {
          mutexType = mutex.substring(0, separatorLoc);
          mutexSpecifier = mutex.substring(separatorLoc + 1);
        }

        if (mutexType === 'file') return runEventuallyWithFile(mutexSpecifier, true).then(exit);
        if (mutexType === 'network') return runEventuallyWithNetwork(mutexSpecifier).then(exit);

        throw new MessageError('Unknown single instance type ' + mutexType);
      }

      return run().then(exit);
    })
    .catch((err) => {
      reporter.verbose(err.stack);

      if (err instanceof ProcessTermError && reporter.isSilent) return exit(err.EXIT_CODE || 1);

      err instanceof MessageError ? reporter.error(err.message) : onUnexpectedError(err);

      command.getDocsInfo && reporter.info(command.getDocsInfo);

      return exit((err instanceof ProcessTermError && err.EXIT_CODE) || 1);
    });
}

async function start() {
  const rc = getRcConfigForCwd(process.cwd(), process.argv.slice(2)),
    yarnPath = rc['yarn-path'] || rc.yarnPath;

  if (yarnPath && !boolifyWithDefault(process.env.YARN_IGNORE_PATH, false)) {
    const argv = process.argv.slice(2),
      opts = {stdio: 'inherit', env: Object.assign({}, process.env, {YARN_IGNORE_PATH: 1})};
    let exitCode = 0;

    process.on('SIGINT', () => {});

    handleSignals();

    try {
      exitCode = /\.[cm]?js$/.test(yarnPath)
        ? await spawnp(process.execPath, [yarnPath, ...argv], opts)
        : await spawnp(yarnPath, argv, opts);
    } catch (firstError) {
      try {
        exitCode = await forkp(yarnPath, argv, opts);
      } catch (_error) {
        throw firstError;
      }
    }

    process.exitCode = exitCode;
  } else {
    const doubleDashIndex = process.argv.indexOf('--'),
      startArgs = process.argv.slice(0, 2),
      args = process.argv.slice(2, doubleDashIndex < 0 ? process.argv.length : doubleDashIndex),
      endArgs = doubleDashIndex < 0 ? [] : process.argv.slice(doubleDashIndex);

    await main({startArgs, args, endArgs});
  }
}

exports = module.exports = start;
const autoRun = (exports.autoRun = require.main === module);

autoRun &&
  start().catch(error => {
    console.error(error.stack || error.message || error);
    process.exitCode = 1;
  });

exports.main = main;
exports.default = start;
