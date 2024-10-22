"use strict";

var astralIdentifierCodes = [
  509, 0, 227, 0, 150, 4, 294, 9, 1368, 2, 2, 1, 6, 3, 41, 2, 5, 0, 166, 1, 574, 3, 9, 9, 370, 1, 81, 2, 71, 10, 50, 3, 123, 2, 54, 14, 32, 10, 3, 1, 11, 3, 46, 10, 8, 0, 46, 9, 7, 2, 37, 13, 2, 9, 6, 1, 45, 0, 13, 2, 49, 13, 9, 3, 2, 11, 83, 11, 7, 0, 3, 0, 158, 11, 6, 9, 7, 3, 56, 1, 2, 6, 3, 1, 3, 2, 10, 0, 11, 1, 3, 6, 4, 4, 193, 17, 10, 9, 5, 0, 82, 19, 13, 9, 214, 6, 3, 8, 28, 1, 83, 16, 16, 9, 82, 12, 9, 9, 84, 14, 5, 9, 243, 14, 166, 9, 71, 5, 2, 1, 3, 3, 2, 0, 2, 1, 13, 9, 120, 6, 3, 6, 4, 0, 29, 9, 41, 6, 2, 3, 9, 0, 10, 10, 47, 15, 406, 7, 2, 7, 17, 9, 57, 21, 2, 13, 123, 5, 4, 0, 2, 1, 2, 6, 2, 0, 9, 9, 49, 4, 2, 1, 2, 4, 9, 9, 330, 3, 10, 1, 2, 0, 49, 6, 4, 4, 14, 9, 5351, 0, 7, 14, 13835, 9, 87, 9, 39, 4, 60, 6, 26, 9, 1014, 0, 2, 54, 8, 3, 82, 0, 12, 1, 19628, 1, 4706, 45, 3, 22, 543, 4, 4, 5, 9, 7, 3, 6, 31, 3, 149, 2, 1418, 49, 513, 54, 5, 49, 9, 0, 15, 0, 23, 4, 2, 14, 1361, 6, 2, 16, 3, 6, 2, 1, 2, 4, 101, 0, 161, 6, 10, 9, 357, 0, 62, 13, 499, 13, 983, 6, 110, 6, 6, 9, 4759, 9, 787719, 239
];

var astralIdentifierStartCodes = [
  0, 11, 2, 25, 2, 18, 2, 1, 2, 14, 3, 13, 35, 122, 70, 52, 268, 28, 4, 48, 48, 31, 14, 29, 6, 37, 11, 29, 3, 35, 5, 7, 2, 4, 43, 157, 19, 35, 5, 35, 5, 39, 9, 51, 13, 10, 2, 14, 2, 6, 2, 1, 2, 10, 2, 14, 2, 6, 2, 1, 68, 310, 10, 21, 11, 7, 25, 5, 2, 41, 2, 8, 70, 5, 3, 0, 2, 43, 2, 1, 4, 0, 3, 22, 11, 22, 10, 30, 66, 18, 2, 1, 11, 21, 11, 25, 71, 55, 7, 1, 65, 0, 16, 3, 2, 2, 2, 28, 43, 28, 4, 28, 36, 7, 2, 27, 28, 53, 11, 21, 11, 18, 14, 17, 111, 72, 56, 50, 14, 50, 14, 35, 349, 41, 7, 1, 79, 28, 11, 0, 9, 21, 43, 17, 47, 20, 28, 22, 13, 52, 58, 1, 3, 0, 14, 44, 33, 24, 27, 35, 30, 0, 3, 0, 9, 34, 4, 0, 13, 47, 15, 3, 22, 0, 2, 0, 36, 17, 2, 24, 20, 1, 64, 6, 2, 0, 2, 3, 2, 14, 2, 9, 8, 46, 39, 7, 3, 1, 3, 21, 2, 6, 2, 1, 2, 4, 4, 0, 19, 0, 13, 4, 159, 52, 19, 3, 21, 2, 31, 47, 21, 1, 2, 0, 185, 46, 42, 3, 37, 47, 21, 0, 60, 42, 14, 0, 72, 26, 38, 6, 186, 43, 117, 63, 32, 7, 3, 0, 3, 7, 2, 1, 2, 23, 16, 0, 2, 0, 95, 7, 3, 38, 17, 0, 2, 0, 29, 0, 11, 39, 8, 0, 22, 0, 12, 45, 20, 0, 19, 72, 264, 8, 2, 36, 18, 0, 50, 29, 113, 6, 2, 1, 2, 37, 22, 0, 26, 5, 2, 1, 2, 31, 15, 0, 328, 18, 16, 0, 2, 12, 2, 33, 125, 0, 80, 921, 103, 110, 18, 195, 2637, 96, 16, 1071, 18, 5, 4026, 582, 8634, 568, 8, 30, 18, 78, 18, 29, 19, 47, 17, 3, 32, 20, 6, 18, 689, 63, 129, 74, 6, 0, 67, 12, 65, 1, 2, 0, 29, 6135, 9, 1237, 43, 8, 8936, 3, 2, 6, 2, 1, 2, 290, 16, 0, 30, 2, 3, 0, 15, 3, 9, 395, 2309, 106, 6, 12, 4, 8, 8, 9, 5991, 84, 2, 70, 2, 1, 3, 0, 3, 1, 3, 3, 2, 11, 2, 0, 2, 6, 2, 64, 2, 3, 3, 7, 2, 6, 2, 27, 2, 3, 2, 4, 2, 0, 4, 6, 2, 339, 3, 24, 2, 24, 2, 30, 2, 24, 2, 30, 2, 24, 2, 30, 2, 24, 2, 30, 2, 24, 2, 7, 1845, 30, 7, 5, 262, 61, 147, 44, 11, 6, 17, 0, 322, 29, 19, 43, 485, 27, 757, 6, 2, 3, 2, 1, 2, 14, 2, 196, 60, 67, 8, 0, 1205, 3, 2, 26, 2, 1, 2, 0, 3, 0, 2, 9, 2, 3, 2, 0, 2, 0, 7, 0, 5, 0, 2, 0, 2, 0, 2, 2, 2, 1, 2, 0, 3, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 1, 2, 0, 3, 3, 2, 6, 2, 3, 2, 3, 2, 0, 2, 9, 2, 16, 6, 2, 2, 4, 2, 16, 4421, 42719, 33, 4153, 7, 221, 3, 5761, 15, 7472, 16, 621, 2467, 541, 1507, 4938, 6, 4191
];

var nonASCIIidentifierChars =
  "\u200c\u200d\xb7\u0300-\u036f\u0387\u0483-\u0487\u0591-\u05bd\u05bf\u05c1\u05c2\u05c4\u05c5\u05c7\u0610-\u061a\u064b-\u0669\u0670\u06d6-\u06dc\u06df-\u06e4\u06e7\u06e8\u06ea-\u06ed\u06f0-\u06f9\u0711\u0730-\u074a\u07a6-\u07b0\u07c0-\u07c9\u07eb-\u07f3\u07fd\u0816-\u0819\u081b-\u0823\u0825-\u0827\u0829-\u082d\u0859-\u085b\u0898-\u089f\u08ca-\u08e1\u08e3-\u0903\u093a-\u093c\u093e-\u094f\u0951-\u0957\u0962\u0963\u0966-\u096f\u0981-\u0983\u09bc\u09be-\u09c4\u09c7\u09c8\u09cb-\u09cd\u09d7\u09e2\u09e3\u09e6-\u09ef\u09fe\u0a01-\u0a03\u0a3c\u0a3e-\u0a42\u0a47\u0a48\u0a4b-\u0a4d\u0a51\u0a66-\u0a71\u0a75\u0a81-\u0a83\u0abc\u0abe-\u0ac5\u0ac7-\u0ac9\u0acb-\u0acd\u0ae2\u0ae3\u0ae6-\u0aef\u0afa-\u0aff\u0b01-\u0b03\u0b3c\u0b3e-\u0b44\u0b47\u0b48\u0b4b-\u0b4d\u0b55-\u0b57\u0b62\u0b63\u0b66-\u0b6f\u0b82\u0bbe-\u0bc2\u0bc6-\u0bc8\u0bca-\u0bcd\u0bd7\u0be6-\u0bef\u0c00-\u0c04\u0c3c\u0c3e-\u0c44\u0c46-\u0c48\u0c4a-\u0c4d\u0c55\u0c56\u0c62\u0c63\u0c66-\u0c6f\u0c81-\u0c83\u0cbc\u0cbe-\u0cc4\u0cc6-\u0cc8\u0cca-\u0ccd\u0cd5\u0cd6\u0ce2\u0ce3\u0ce6-\u0cef\u0cf3\u0d00-\u0d03\u0d3b\u0d3c\u0d3e-\u0d44\u0d46-\u0d48\u0d4a-\u0d4d\u0d57\u0d62\u0d63\u0d66-\u0d6f\u0d81-\u0d83\u0dca\u0dcf-\u0dd4\u0dd6\u0dd8-\u0ddf\u0de6-\u0def\u0df2\u0df3\u0e31\u0e34-\u0e3a\u0e47-\u0e4e\u0e50-\u0e59\u0eb1\u0eb4-\u0ebc\u0ec8-\u0ece\u0ed0-\u0ed9\u0f18\u0f19\u0f20-\u0f29\u0f35\u0f37\u0f39\u0f3e\u0f3f\u0f71-\u0f84\u0f86\u0f87\u0f8d-\u0f97\u0f99-\u0fbc\u0fc6\u102b-\u103e\u1040-\u1049\u1056-\u1059\u105e-\u1060\u1062-\u1064\u1067-\u106d\u1071-\u1074\u1082-\u108d\u108f-\u109d\u135d-\u135f\u1369-\u1371\u1712-\u1715\u1732-\u1734\u1752\u1753\u1772\u1773\u17b4-\u17d3\u17dd\u17e0-\u17e9\u180b-\u180d\u180f-\u1819\u18a9\u1920-\u192b\u1930-\u193b\u1946-\u194f\u19d0-\u19da\u1a17-\u1a1b\u1a55-\u1a5e\u1a60-\u1a7c\u1a7f-\u1a89\u1a90-\u1a99\u1ab0-\u1abd\u1abf-\u1ace\u1b00-\u1b04\u1b34-\u1b44\u1b50-\u1b59\u1b6b-\u1b73\u1b80-\u1b82\u1ba1-\u1bad\u1bb0-\u1bb9\u1be6-\u1bf3\u1c24-\u1c37\u1c40-\u1c49\u1c50-\u1c59\u1cd0-\u1cd2\u1cd4-\u1ce8\u1ced\u1cf4\u1cf7-\u1cf9\u1dc0-\u1dff\u200c\u200d\u203f\u2040\u2054\u20d0-\u20dc\u20e1\u20e5-\u20f0\u2cef-\u2cf1\u2d7f\u2de0-\u2dff\u302a-\u302f\u3099\u309a\u30fb\ua620-\ua629\ua66f\ua674-\ua67d\ua69e\ua69f\ua6f0\ua6f1\ua802\ua806\ua80b\ua823-\ua827\ua82c\ua880\ua881\ua8b4-\ua8c5\ua8d0-\ua8d9\ua8e0-\ua8f1\ua8ff-\ua909\ua926-\ua92d\ua947-\ua953\ua980-\ua983\ua9b3-\ua9c0\ua9d0-\ua9d9\ua9e5\ua9f0-\ua9f9\uaa29-\uaa36\uaa43\uaa4c\uaa4d\uaa50-\uaa59\uaa7b-\uaa7d\uaab0\uaab2-\uaab4\uaab7\uaab8\uaabe\uaabf\uaac1\uaaeb-\uaaef\uaaf5\uaaf6\uabe3-\uabea\uabec\uabed\uabf0-\uabf9\ufb1e\ufe00-\ufe0f\ufe20-\ufe2f\ufe33\ufe34\ufe4d-\ufe4f\uff10-\uff19\uff3f\uff65";

var nonASCIIidentifierStartChars =
  "\xaa\xb5\xba\xc0-\xd6\xd8-\xf6\xf8-\u02c1\u02c6-\u02d1\u02e0-\u02e4\u02ec\u02ee\u0370-\u0374\u0376\u0377\u037a-\u037d\u037f\u0386\u0388-\u038a\u038c\u038e-\u03a1\u03a3-\u03f5\u03f7-\u0481\u048a-\u052f\u0531-\u0556\u0559\u0560-\u0588\u05d0-\u05ea\u05ef-\u05f2\u0620-\u064a\u066e\u066f\u0671-\u06d3\u06d5\u06e5\u06e6\u06ee\u06ef\u06fa-\u06fc\u06ff\u0710\u0712-\u072f\u074d-\u07a5\u07b1\u07ca-\u07ea\u07f4\u07f5\u07fa\u0800-\u0815\u081a\u0824\u0828\u0840-\u0858\u0860-\u086a\u0870-\u0887\u0889-\u088e\u08a0-\u08c9\u0904-\u0939\u093d\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098c\u098f\u0990\u0993-\u09a8\u09aa-\u09b0\u09b2\u09b6-\u09b9\u09bd\u09ce\u09dc\u09dd\u09df-\u09e1\u09f0\u09f1\u09fc\u0a05-\u0a0a\u0a0f\u0a10\u0a13-\u0a28\u0a2a-\u0a30\u0a32\u0a33\u0a35\u0a36\u0a38\u0a39\u0a59-\u0a5c\u0a5e\u0a72-\u0a74\u0a85-\u0a8d\u0a8f-\u0a91\u0a93-\u0aa8\u0aaa-\u0ab0\u0ab2\u0ab3\u0ab5-\u0ab9\u0abd\u0ad0\u0ae0\u0ae1\u0af9\u0b05-\u0b0c\u0b0f\u0b10\u0b13-\u0b28\u0b2a-\u0b30\u0b32\u0b33\u0b35-\u0b39\u0b3d\u0b5c\u0b5d\u0b5f-\u0b61\u0b71\u0b83\u0b85-\u0b8a\u0b8e-\u0b90\u0b92-\u0b95\u0b99\u0b9a\u0b9c\u0b9e\u0b9f\u0ba3\u0ba4\u0ba8-\u0baa\u0bae-\u0bb9\u0bd0\u0c05-\u0c0c\u0c0e-\u0c10\u0c12-\u0c28\u0c2a-\u0c39\u0c3d\u0c58-\u0c5a\u0c5d\u0c60\u0c61\u0c80\u0c85-\u0c8c\u0c8e-\u0c90\u0c92-\u0ca8\u0caa-\u0cb3\u0cb5-\u0cb9\u0cbd\u0cdd\u0cde\u0ce0\u0ce1\u0cf1\u0cf2\u0d04-\u0d0c\u0d0e-\u0d10\u0d12-\u0d3a\u0d3d\u0d4e\u0d54-\u0d56\u0d5f-\u0d61\u0d7a-\u0d7f\u0d85-\u0d96\u0d9a-\u0db1\u0db3-\u0dbb\u0dbd\u0dc0-\u0dc6\u0e01-\u0e30\u0e32\u0e33\u0e40-\u0e46\u0e81\u0e82\u0e84\u0e86-\u0e8a\u0e8c-\u0ea3\u0ea5\u0ea7-\u0eb0\u0eb2\u0eb3\u0ebd\u0ec0-\u0ec4\u0ec6\u0edc-\u0edf\u0f00\u0f40-\u0f47\u0f49-\u0f6c\u0f88-\u0f8c\u1000-\u102a\u103f\u1050-\u1055\u105a-\u105d\u1061\u1065\u1066\u106e-\u1070\u1075-\u1081\u108e\u10a0-\u10c5\u10c7\u10cd\u10d0-\u10fa\u10fc-\u1248\u124a-\u124d\u1250-\u1256\u1258\u125a-\u125d\u1260-\u1288\u128a-\u128d\u1290-\u12b0\u12b2-\u12b5\u12b8-\u12be\u12c0\u12c2-\u12c5\u12c8-\u12d6\u12d8-\u1310\u1312-\u1315\u1318-\u135a\u1380-\u138f\u13a0-\u13f5\u13f8-\u13fd\u1401-\u166c\u166f-\u167f\u1681-\u169a\u16a0-\u16ea\u16ee-\u16f8\u1700-\u1711\u171f-\u1731\u1740-\u1751\u1760-\u176c\u176e-\u1770\u1780-\u17b3\u17d7\u17dc\u1820-\u1878\u1880-\u18a8\u18aa\u18b0-\u18f5\u1900-\u191e\u1950-\u196d\u1970-\u1974\u1980-\u19ab\u19b0-\u19c9\u1a00-\u1a16\u1a20-\u1a54\u1aa7\u1b05-\u1b33\u1b45-\u1b4c\u1b83-\u1ba0\u1bae\u1baf\u1bba-\u1be5\u1c00-\u1c23\u1c4d-\u1c4f\u1c5a-\u1c7d\u1c80-\u1c88\u1c90-\u1cba\u1cbd-\u1cbf\u1ce9-\u1cec\u1cee-\u1cf3\u1cf5\u1cf6\u1cfa\u1d00-\u1dbf\u1e00-\u1f15\u1f18-\u1f1d\u1f20-\u1f45\u1f48-\u1f4d\u1f50-\u1f57\u1f59\u1f5b\u1f5d\u1f5f-\u1f7d\u1f80-\u1fb4\u1fb6-\u1fbc\u1fbe\u1fc2-\u1fc4\u1fc6-\u1fcc\u1fd0-\u1fd3\u1fd6-\u1fdb\u1fe0-\u1fec\u1ff2-\u1ff4\u1ff6-\u1ffc\u2071\u207f\u2090-\u209c\u2102\u2107\u210a-\u2113\u2115\u2118-\u211d\u2124\u2126\u2128\u212a-\u2139\u213c-\u213f\u2145-\u2149\u214e\u2160-\u2188\u2c00-\u2ce4\u2ceb-\u2cee\u2cf2\u2cf3\u2d00-\u2d25\u2d27\u2d2d\u2d30-\u2d67\u2d6f\u2d80-\u2d96\u2da0-\u2da6\u2da8-\u2dae\u2db0-\u2db6\u2db8-\u2dbe\u2dc0-\u2dc6\u2dc8-\u2dce\u2dd0-\u2dd6\u2dd8-\u2dde\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303c\u3041-\u3096\u309b-\u309f\u30a1-\u30fa\u30fc-\u30ff\u3105-\u312f\u3131-\u318e\u31a0-\u31bf\u31f0-\u31ff\u3400-\u4dbf\u4e00-\ua48c\ua4d0-\ua4fd\ua500-\ua60c\ua610-\ua61f\ua62a\ua62b\ua640-\ua66e\ua67f-\ua69d\ua6a0-\ua6ef\ua717-\ua71f\ua722-\ua788\ua78b-\ua7ca\ua7d0\ua7d1\ua7d3\ua7d5-\ua7d9\ua7f2-\ua801\ua803-\ua805\ua807-\ua80a\ua80c-\ua822\ua840-\ua873\ua882-\ua8b3\ua8f2-\ua8f7\ua8fb\ua8fd\ua8fe\ua90a-\ua925\ua930-\ua946\ua960-\ua97c\ua984-\ua9b2\ua9cf\ua9e0-\ua9e4\ua9e6-\ua9ef\ua9fa-\ua9fe\uaa00-\uaa28\uaa40-\uaa42\uaa44-\uaa4b\uaa60-\uaa76\uaa7a\uaa7e-\uaaaf\uaab1\uaab5\uaab6\uaab9-\uaabd\uaac0\uaac2\uaadb-\uaadd\uaae0-\uaaea\uaaf2-\uaaf4\uab01-\uab06\uab09-\uab0e\uab11-\uab16\uab20-\uab26\uab28-\uab2e\uab30-\uab5a\uab5c-\uab69\uab70-\uabe2\uac00-\ud7a3\ud7b0-\ud7c6\ud7cb-\ud7fb\uf900-\ufa6d\ufa70-\ufad9\ufb00-\ufb06\ufb13-\ufb17\ufb1d\ufb1f-\ufb28\ufb2a-\ufb36\ufb38-\ufb3c\ufb3e\ufb40\ufb41\ufb43\ufb44\ufb46-\ufbb1\ufbd3-\ufd3d\ufd50-\ufd8f\ufd92-\ufdc7\ufdf0-\ufdfb\ufe70-\ufe74\ufe76-\ufefc\uff21-\uff3a\uff41-\uff5a\uff66-\uffbe\uffc2-\uffc7\uffca-\uffcf\uffd2-\uffd7\uffda-\uffdc";

var reservedWords = {
  3: "abstract boolean byte char class double enum export extends final float goto implements import int interface long native package private protected public short static super synchronized throws transient volatile",
  5: "class enum extends super const export import",
  6: "enum",
  strict: "implements interface let package private protected public static yield",
  strictBind: "eval arguments"
};

var ecma5AndLessKeywords =
  "break case catch continue debugger default do else finally for function if return switch throw try var while with null true false instanceof typeof void delete new in this";

var keywords$1 = {
  5: ecma5AndLessKeywords,
  "5module": ecma5AndLessKeywords + " export import",
  6: ecma5AndLessKeywords + " const class extends export import super"
};

var keywordRelationalOperator = /^in(stanceof)?$/,

  nonASCIIidentifierStart = new RegExp("[" + nonASCIIidentifierStartChars + "]"),
  nonASCIIidentifier = new RegExp("[" + nonASCIIidentifierStartChars + nonASCIIidentifierChars + "]");

function isInAstralSet(code, set) {
  for (var pos = 0x10000, i = 0; i < set.length; i += 2) {
    if ((pos += set[i]) > code) return false;
    if ((pos += set[i + 1]) >= code) return true;
  }
  return false;
}

function isIdentifierStart(code, astral) {
  return code < 65
    ? code === 36
    : code < 91 ||
      (code < 97
        ? code === 95
        : code < 123 ||
          (code <= 0xffff
            ? code >= 0xaa && nonASCIIidentifierStart.test(String.fromCharCode(code))
            : astral !== false && isInAstralSet(code, astralIdentifierStartCodes)));
}

function isIdentifierChar(code, astral) {
  return code < 48
    ? code === 36
    : code < 58 || (code >= 65 && (code < 91 || (
        code < 97
          ? code === 95
          : code < 123 ||
            (code <= 0xffff
              ? code >= 0xaa && nonASCIIidentifier.test(String.fromCharCode(code))
              : astral !== false &&
                (isInAstralSet(code, astralIdentifierStartCodes) || isInAstralSet(code, astralIdentifierCodes)))
      )));
}

function TokenType(label, conf) {
  if (conf === void 0) conf = {};

  this.label = label;
  this.keyword = conf.keyword;
  this.beforeExpr = !!conf.beforeExpr;
  this.startsExpr = !!conf.startsExpr;
  this.isLoop = !!conf.isLoop;
  this.isAssign = !!conf.isAssign;
  this.prefix = !!conf.prefix;
  this.postfix = !!conf.postfix;
  this.binop = conf.binop || null;
  this.updateContext = null;
}

function binop(name, prec) {
  return new TokenType(name, {beforeExpr: true, binop: prec});
}
var beforeExpr = {beforeExpr: true},
  startsExpr = {startsExpr: true},

  keywords = {};

function kw(name, options) {
  if (options === void 0) options = {};

  options.keyword = name;
  return (keywords[name] = new TokenType(name, options));
}

var types$1 = {
  num: new TokenType("num", startsExpr),
  regexp: new TokenType("regexp", startsExpr),
  string: new TokenType("string", startsExpr),
  name: new TokenType("name", startsExpr),
  privateId: new TokenType("privateId", startsExpr),
  eof: new TokenType("eof"),

  bracketL: new TokenType("[", {beforeExpr: true, startsExpr: true}),
  bracketR: new TokenType("]"),
  braceL: new TokenType("{", {beforeExpr: true, startsExpr: true}),
  braceR: new TokenType("}"),
  parenL: new TokenType("(", {beforeExpr: true, startsExpr: true}),
  parenR: new TokenType(")"),
  comma: new TokenType(",", beforeExpr),
  semi: new TokenType(";", beforeExpr),
  colon: new TokenType(":", beforeExpr),
  dot: new TokenType("."),
  question: new TokenType("?", beforeExpr),
  questionDot: new TokenType("?."),
  arrow: new TokenType("=>", beforeExpr),
  template: new TokenType("template"),
  invalidTemplate: new TokenType("invalidTemplate"),
  ellipsis: new TokenType("...", beforeExpr),
  backQuote: new TokenType("`", startsExpr),
  dollarBraceL: new TokenType("${", {beforeExpr: true, startsExpr: true}),

  eq: new TokenType("=", {beforeExpr: true, isAssign: true}),
  assign: new TokenType("_=", {beforeExpr: true, isAssign: true}),
  incDec: new TokenType("++/--", {prefix: true, postfix: true, startsExpr: true}),
  prefix: new TokenType("!/~", {beforeExpr: true, prefix: true, startsExpr: true}),
  logicalOR: binop("||", 1),
  logicalAND: binop("&&", 2),
  bitwiseOR: binop("|", 3),
  bitwiseXOR: binop("^", 4),
  bitwiseAND: binop("&", 5),
  equality: binop("==/!=/===/!==", 6),
  relational: binop("</>/<=/>=", 7),
  bitShift: binop("<</>>/>>>", 8),
  plusMin: new TokenType("+/-", {beforeExpr: true, binop: 9, prefix: true, startsExpr: true}),
  modulo: binop("%", 10),
  star: binop("*", 10),
  slash: binop("/", 10),
  starstar: new TokenType("**", {beforeExpr: true}),
  coalesce: binop("??", 1),

  _break: kw("break"),
  _case: kw("case", beforeExpr),
  _catch: kw("catch"),
  _continue: kw("continue"),
  _debugger: kw("debugger"),
  _default: kw("default", beforeExpr),
  _do: kw("do", {isLoop: true, beforeExpr: true}),
  _else: kw("else", beforeExpr),
  _finally: kw("finally"),
  _for: kw("for", {isLoop: true}),
  _function: kw("function", startsExpr),
  _if: kw("if"),
  _return: kw("return", beforeExpr),
  _switch: kw("switch"),
  _throw: kw("throw", beforeExpr),
  _try: kw("try"),
  _var: kw("var"),
  _const: kw("const"),
  _while: kw("while", {isLoop: true}),
  _with: kw("with"),
  _new: kw("new", {beforeExpr: true, startsExpr: true}),
  _this: kw("this", startsExpr),
  _super: kw("super", startsExpr),
  _class: kw("class", startsExpr),
  _extends: kw("extends", beforeExpr),
  _export: kw("export"),
  _import: kw("import", startsExpr),
  _null: kw("null", startsExpr),
  _true: kw("true", startsExpr),
  _false: kw("false", startsExpr),
  _in: kw("in", {beforeExpr: true, binop: 7}),
  _instanceof: kw("instanceof", {beforeExpr: true, binop: 7}),
  _typeof: kw("typeof", {beforeExpr: true, prefix: true, startsExpr: true}),
  _void: kw("void", {beforeExpr: true, prefix: true, startsExpr: true}),
  _delete: kw("delete", {beforeExpr: true, prefix: true, startsExpr: true})
};

var lineBreak = /\r\n?|\n|\u2028|\u2029/,
  lineBreakG = new RegExp(lineBreak.source, "g");

function isNewLine(code) {
  return code === 10 || code === 13 || code === 0x2028 || code === 0x2029;
}

function nextLineBreak(code, from, end) {
  if (end === void 0) end = code.length;

  for (var i = from; i < end; i++) {
    var next = code.charCodeAt(i);
    if (isNewLine(next)) return i < end - 1 && next === 13 && code.charCodeAt(i + 1) === 10 ? i + 2 : i + 1;
  }
  return -1;
}

var nonASCIIwhitespace = /[\u1680\u2000-\u200a\u202f\u205f\u3000\ufeff]/,
  skipWhiteSpace = /(?:\s|\/\/.*|\/\*[^]*?\*\/)*/g,

  hasOwnProperty = Object.prototype.hasOwnProperty,
  toString = Object.prototype.toString;

var hasOwn = Object.hasOwn || function(obj, propName) {
  return hasOwnProperty.call(obj, propName);
};

var isArray = Array.isArray || function(obj) {
  return toString.call(obj) === "[object Array]";
};

var regexpCache = Object.create(null);

function wordsRegexp(words) {
  return regexpCache[words] || (regexpCache[words] = new RegExp("^(?:" + words.replace(/ /g, "|") + ")$"));
}

function codePointToString(code) {
  if (code <= 0xFFFF) return String.fromCharCode(code);
  code -= 0x10000;
  return String.fromCharCode(0xD800 + (code >> 10), 0xDC00 + (code & 1023));
}

var loneSurrogate = /(?:[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])/;

function Position(line, col) {
  this.line = line;
  this.column = col;
}

Position.prototype.offset = function(n) {
  return new Position(this.line, this.column + n);
};

function SourceLocation(p, start, end) {
  this.start = start;
  this.end = end;
  if (p.sourceFile !== null) this.source = p.sourceFile;
}

function getLineInfo(input, offset) {
  for (var line = 1, cur = 0; ; ) {
    var nextBreak = nextLineBreak(input, cur, offset);
    if (nextBreak < 0) return new Position(line, offset - cur);
    ++line;
    cur = nextBreak;
  }
}

var defaultOptions = {
  ecmaVersion: null,
  sourceType: "script",
  onInsertedSemicolon: null,
  onTrailingComma: null,
  allowReserved: null,
  allowReturnOutsideFunction: false,
  allowImportExportEverywhere: false,
  allowAwaitOutsideFunction: null,
  allowSuperOutsideMethod: null,
  allowHashBang: false,
  checkPrivateFields: true,
  locations: false,
  onToken: null,
  onComment: null,
  ranges: false,
  program: null,
  sourceFile: null,
  directSourceFile: null,
  preserveParens: false
};

var warnedAboutEcmaVersion = false;

function getOptions(opts) {
  var options = {};

  for (var opt in defaultOptions) options[opt] = opts && hasOwn(opts, opt) ? opts[opt] : defaultOptions[opt];

  if (options.ecmaVersion === "latest") options.ecmaVersion = 1e8;
  else if (options.ecmaVersion == null) {
    if (!warnedAboutEcmaVersion && typeof console == "object" && console.warn) {
      warnedAboutEcmaVersion = true;
      console.warn("Since Acorn 8.0.0, options.ecmaVersion is required.\nDefaulting to 2020, but this will stop working in the future.");
    }
    options.ecmaVersion = 11;
  } else if (options.ecmaVersion >= 2015) options.ecmaVersion -= 2009;

  if (options.allowReserved == null) options.allowReserved = options.ecmaVersion < 5;

  (opts && opts.allowHashBang != null) || (options.allowHashBang = options.ecmaVersion >= 14);

  if (isArray(options.onToken)) {
    var tokens = options.onToken;
    options.onToken = function(token) { return tokens.push(token); };
  }
  if (isArray(options.onComment)) options.onComment = pushComment(options, options.onComment);

  return options;
}

function pushComment(options, array) {
  return function(block, text, start, end, startLoc, endLoc) {
    var comment = {type: block ? "Block" : "Line", value: text, start: start, end: end};
    if (options.locations) comment.loc = new SourceLocation(this, startLoc, endLoc);
    if (options.ranges) comment.range = [start, end];
    array.push(comment);
  };
}

var SCOPE_TOP = 1,
  SCOPE_FUNCTION = 2,
  SCOPE_ASYNC = 4,
  SCOPE_GENERATOR = 8,
  SCOPE_ARROW = 16,
  SCOPE_SIMPLE_CATCH = 32,
  SCOPE_SUPER = 64,
  SCOPE_DIRECT_SUPER = 128,
  SCOPE_CLASS_STATIC_BLOCK = 256,
  SCOPE_VAR = SCOPE_TOP | SCOPE_FUNCTION | SCOPE_CLASS_STATIC_BLOCK;

function functionFlags(async, generator) {
  return SCOPE_FUNCTION | (async ? SCOPE_ASYNC : 0) | (generator ? SCOPE_GENERATOR : 0);
}

var BIND_NONE = 0,
  BIND_VAR = 1,
  BIND_LEXICAL = 2,
  BIND_FUNCTION = 3,
  BIND_SIMPLE_CATCH = 4,
  BIND_OUTSIDE = 5;

/** @constructor */
function Parser(options, input, startPos) {
  this.options = options = getOptions(options);
  this.sourceFile = options.sourceFile;
  this.keywords = wordsRegexp(keywords$1[options.ecmaVersion >= 6 ? 6 : options.sourceType === "module" ? "5module" : 5]);
  var reserved = "";
  if (options.allowReserved !== true) {
    reserved = reservedWords[options.ecmaVersion >= 6 ? 6 : options.ecmaVersion === 5 ? 5 : 3];
    if (options.sourceType === "module") reserved += " await";
  }
  this.reservedWords = wordsRegexp(reserved);
  var reservedStrict = (reserved ? reserved + " " : "") + reservedWords.strict;
  this.reservedWordsStrict = wordsRegexp(reservedStrict);
  this.reservedWordsStrictBind = wordsRegexp(reservedStrict + " " + reservedWords.strictBind);
  this.input = String(input);

  this.containsEsc = false;

  if (startPos) {
    this.pos = startPos;
    this.lineStart = this.input.lastIndexOf("\n", startPos - 1) + 1;
    this.curLine = this.input.slice(0, this.lineStart).split(lineBreak).length;
  } else {
    this.pos = this.lineStart = 0;
    this.curLine = 1;
  }

  this.type = types$1.eof;
  this.value = null;
  this.start = this.end = this.pos;
  this.startLoc = this.endLoc = this.curPosition();

  this.lastTokEndLoc = this.lastTokStartLoc = null;
  this.lastTokStart = this.lastTokEnd = this.pos;

  this.context = this.initialContext();
  this.exprAllowed = true;

  this.inModule = options.sourceType === "module";
  this.strict = this.inModule || this.strictDirective(this.pos);

  this.potentialArrowAt = -1;
  this.potentialArrowInForAwait = false;

  this.yieldPos = this.awaitPos = this.awaitIdentPos = 0;
  this.labels = [];
  this.undefinedExports = Object.create(null);

  this.pos === 0 && options.allowHashBang && this.input.slice(0, 2) === "#!" && this.skipLineComment(2);

  this.scopeStack = [];
  this.enterScope(SCOPE_TOP);

  this.regexpState = null;

  this.privateNameStack = [];
}

var prototypeAccessors = {
  inFunction: {configurable: true},
  inGenerator: {configurable: true},
  inAsync: {configurable: true},
  canAwait: {configurable: true},
  allowSuper: {configurable: true},
  allowDirectSuper: {configurable: true},
  treatFunctionsAsVar: {configurable: true},
  allowNewDotTarget: {configurable: true},
  inClassStaticBlock: {configurable: true}
};

Parser.prototype.parse = function() {
  var node = this.options.program || this.startNode();
  this.nextToken();
  return this.parseTopLevel(node);
};

prototypeAccessors.inFunction.get = function() {
  return (this.currentVarScope().flags & SCOPE_FUNCTION) > 0;
};

prototypeAccessors.inGenerator.get = function() {
  return (this.currentVarScope().flags & SCOPE_GENERATOR) > 0 && !this.currentVarScope().inClassFieldInit;
};

prototypeAccessors.inAsync.get = function() {
  return (this.currentVarScope().flags & SCOPE_ASYNC) > 0 && !this.currentVarScope().inClassFieldInit;
};

prototypeAccessors.canAwait.get = function() {
  for (var i = this.scopeStack.length - 1; i >= 0; i--) {
    var scope = this.scopeStack[i];
    if (scope.inClassFieldInit || scope.flags & SCOPE_CLASS_STATIC_BLOCK) return false;
    if (scope.flags & SCOPE_FUNCTION) return (scope.flags & SCOPE_ASYNC) > 0;
  }
  return (this.inModule && this.options.ecmaVersion >= 13) || this.options.allowAwaitOutsideFunction;
};

prototypeAccessors.allowSuper.get = function() {
  var ref = this.currentThisScope(),
    flags = ref.flags,
    inClassFieldInit = ref.inClassFieldInit;
  return (flags & SCOPE_SUPER) > 0 || inClassFieldInit || this.options.allowSuperOutsideMethod;
};

prototypeAccessors.allowDirectSuper.get = function() {
  return (this.currentThisScope().flags & SCOPE_DIRECT_SUPER) > 0;
};

prototypeAccessors.treatFunctionsAsVar.get = function() {
  return this.treatFunctionsAsVarInScope(this.currentScope());
};

prototypeAccessors.allowNewDotTarget.get = function() {
  var ref = this.currentThisScope(),
    flags = ref.flags,
    inClassFieldInit = ref.inClassFieldInit;
  return (flags & (SCOPE_FUNCTION | SCOPE_CLASS_STATIC_BLOCK)) > 0 || inClassFieldInit;
};

prototypeAccessors.inClassStaticBlock.get = function() {
  return (this.currentVarScope().flags & SCOPE_CLASS_STATIC_BLOCK) > 0;
};

Parser.extend = function() {
  var plugins = [];
  for (var len = arguments.length; len--; ) plugins[len] = arguments[len];

  var cls = this;
  for (var i = 0; i < plugins.length; i++) cls = plugins[i](cls);
  return cls;
};

Parser.parse = function(input, options) {
  return new this(options, input).parse();
};

Parser.parseExpressionAt = function(input, pos, options) {
  var parser = new this(options, input, pos);
  parser.nextToken();
  return parser.parseExpression();
};

Parser.tokenizer = function(input, options) {
  return new this(options, input);
};

var pp = Parser.prototype;
Object.defineProperties(pp, prototypeAccessors);

var literal = /^(?:'((?:\\.|[^'\\])*?)'|"((?:\\.|[^"\\])*?)")/;
pp.strictDirective = function(start) {
  if (this.options.ecmaVersion < 5) return false;
  for (;;) {
    skipWhiteSpace.lastIndex = start;
    start += skipWhiteSpace.exec(this.input)[0].length;
    var match = literal.exec(this.input.slice(start));
    if (!match) return false;
    if ((match[1] || match[2]) === "use strict") {
      skipWhiteSpace.lastIndex = start + match[0].length;
      var spaceAfter = skipWhiteSpace.exec(this.input),
        end = spaceAfter.index + spaceAfter[0].length,
        next = this.input.charAt(end);
      return (
        next === ";" || next === "}" ||
        (lineBreak.test(spaceAfter[0]) && !/[(`.[+\-/*%<>=,?^&]/.test(next) && (next !== "!" || this.input.charAt(end + 1) !== "="))
      );
    }
    start += match[0].length;

    skipWhiteSpace.lastIndex = start;
    start += skipWhiteSpace.exec(this.input)[0].length;
    this.input[start] !== ";" || start++;
  }
};

pp.eat = function(type) {
  if (this.type === type) {
    this.next();
    return true;
  }
  return false;
};

pp.isContextual = function(name) {
  return this.type === types$1.name && this.value === name && !this.containsEsc;
};

pp.eatContextual = function(name) {
  if (!this.isContextual(name)) return false;
  this.next();
  return true;
};

pp.expectContextual = function(name) {
  this.eatContextual(name) || this.unexpected();
};

pp.canInsertSemicolon = function() {
  return this.type === types$1.eof || this.type === types$1.braceR || lineBreak.test(this.input.slice(this.lastTokEnd, this.start));
};

pp.insertSemicolon = function() {
  if (this.canInsertSemicolon()) {
    this.options.onInsertedSemicolon && this.options.onInsertedSemicolon(this.lastTokEnd, this.lastTokEndLoc);
    return true;
  }
};

pp.semicolon = function() {
  this.eat(types$1.semi) || this.insertSemicolon() || this.unexpected();
};

pp.afterTrailingComma = function(tokType, notNext) {
  if (this.type === tokType) {
    this.options.onTrailingComma && this.options.onTrailingComma(this.lastTokStart, this.lastTokStartLoc);
    notNext || this.next();
    return true;
  }
};

pp.expect = function(type) {
  this.eat(type) || this.unexpected();
};

pp.unexpected = function(pos) {
  this.raise(pos != null ? pos : this.start, "Unexpected token");
};

function DestructuringErrors() {
  this.shorthandAssign = this.trailingComma = this.parenthesizedAssign = this.parenthesizedBind = this.doubleProto = -1;
}

pp.checkPatternErrors = function(refDestructuringErrors, isAssign) {
  if (!refDestructuringErrors) return;
  refDestructuringErrors.trailingComma > -1 &&
    this.raiseRecoverable(refDestructuringErrors.trailingComma, "Comma is not permitted after the rest element");
  var parens = isAssign ? refDestructuringErrors.parenthesizedAssign : refDestructuringErrors.parenthesizedBind;
  parens > -1 && this.raiseRecoverable(parens, isAssign ? "Assigning to rvalue" : "Parenthesized pattern");
};

pp.checkExpressionErrors = function(refDestructuringErrors, andThrow) {
  if (!refDestructuringErrors) return false;
  var shorthandAssign = refDestructuringErrors.shorthandAssign,
    doubleProto = refDestructuringErrors.doubleProto;
  if (!andThrow) return shorthandAssign >= 0 || doubleProto >= 0;
  shorthandAssign < 0 || this.raise(shorthandAssign, "Shorthand property assignments are valid only in destructuring patterns");
  doubleProto < 0 || this.raiseRecoverable(doubleProto, "Redefinition of __proto__ property");
};

pp.checkYieldAwaitInDefaultParams = function() {
  this.yieldPos && (!this.awaitPos || this.yieldPos < this.awaitPos) &&
    this.raise(this.yieldPos, "Yield expression cannot be a default value");
  this.awaitPos && this.raise(this.awaitPos, "Await expression cannot be a default value");
};

pp.isSimpleAssignTarget = function(expr) {
  return expr.type === "ParenthesizedExpression"
    ? this.isSimpleAssignTarget(expr.expression)
    : expr.type === "Identifier" || expr.type === "MemberExpression";
};

pp.parseTopLevel = function(node) {
  var exports = Object.create(null);
  node.body || (node.body = []);
  while (this.type !== types$1.eof) {
    var stmt = this.parseStatement(null, true, exports);
    node.body.push(stmt);
  }
  if (this.inModule)
    for (var i = 0, list = Object.keys(this.undefinedExports); i < list.length; i++) {
      var name = list[i];

      this.raiseRecoverable(this.undefinedExports[name].start, "Export '" + name + "' is not defined");
    }
  this.adaptDirectivePrologue(node.body);
  this.next();
  node.sourceType = this.options.sourceType;
  return this.finishNode(node, "Program");
};

var loopLabel = {kind: "loop"},
  switchLabel = {kind: "switch"};

pp.isLet = function(context) {
  if (this.options.ecmaVersion < 6 || !this.isContextual("let")) return false;
  skipWhiteSpace.lastIndex = this.pos;
  var skip = skipWhiteSpace.exec(this.input),
    next = this.pos + skip[0].length,
    nextCh = this.input.charCodeAt(next);
  if (nextCh === 91 || nextCh === 92) return true;
  if (context) return false;

  if (nextCh === 123 || (nextCh > 0xd7ff && nextCh < 0xdc00)) return true;
  if (isIdentifierStart(nextCh, true)) {
    var pos = next + 1;
    while (isIdentifierChar((nextCh = this.input.charCodeAt(pos)), true)) ++pos;
    if (nextCh === 92 || (nextCh > 0xd7ff && nextCh < 0xdc00)) return true;
    var ident = this.input.slice(next, pos);
    if (!keywordRelationalOperator.test(ident)) return true;
  }
  return false;
};

pp.isAsyncFunction = function() {
  if (this.options.ecmaVersion < 8 || !this.isContextual("async")) return false;

  skipWhiteSpace.lastIndex = this.pos;
  var after, skip = skipWhiteSpace.exec(this.input),
    next = this.pos + skip[0].length;
  return !(
    lineBreak.test(this.input.slice(this.pos, next)) ||
    this.input.slice(next, next + 8) !== "function" ||
    (next + 8 !== this.input.length &&
      (isIdentifierChar((after = this.input.charCodeAt(next + 8))) || (after > 0xd7ff && after < 0xdc00)))
  );
};

pp.parseStatement = function(context, topLevel, exports) {
  var kind, starttype = this.type, node = this.startNode();

  if (this.isLet(context)) {
    starttype = types$1._var;
    kind = "let";
  }

  switch (starttype) {
  case types$1._break: case types$1._continue: return this.parseBreakContinueStatement(node, starttype.keyword);
  case types$1._debugger: return this.parseDebuggerStatement(node);
  case types$1._do: return this.parseDoStatement(node);
  case types$1._for: return this.parseForStatement(node);
  case types$1._function:
    context && (this.strict || (context !== "if" && context !== "label")) && this.options.ecmaVersion >= 6 && this.unexpected();
    return this.parseFunctionStatement(node, false, !context);
  case types$1._class:
    context && this.unexpected();
    return this.parseClass(node, true);
  case types$1._if: return this.parseIfStatement(node);
  case types$1._return: return this.parseReturnStatement(node);
  case types$1._switch: return this.parseSwitchStatement(node);
  case types$1._throw: return this.parseThrowStatement(node);
  case types$1._try: return this.parseTryStatement(node);
  case types$1._const: case types$1._var:
    kind = kind || this.value;
    context && kind !== "var" && this.unexpected();
    return this.parseVarStatement(node, kind);
  case types$1._while: return this.parseWhileStatement(node);
  case types$1._with: return this.parseWithStatement(node);
  case types$1.braceL: return this.parseBlock(true, node);
  case types$1.semi: return this.parseEmptyStatement(node);
  case types$1._export:
  case types$1._import:
    if (this.options.ecmaVersion > 10 && starttype === types$1._import) {
      skipWhiteSpace.lastIndex = this.pos;
      var skip = skipWhiteSpace.exec(this.input),
        next = this.pos + skip[0].length, nextCh = this.input.charCodeAt(next);
      if (nextCh === 40 || nextCh === 46) return this.parseExpressionStatement(node, this.parseExpression());
    }

    if (!this.options.allowImportExportEverywhere) {
      topLevel || this.raise(this.start, "'import' and 'export' may only appear at the top level");
      this.inModule || this.raise(this.start, "'import' and 'export' may appear only with 'sourceType: module'");
    }
    return starttype === types$1._import ? this.parseImport(node) : this.parseExport(node, exports);

  default:
    if (this.isAsyncFunction()) {
      context && this.unexpected();
      this.next();
      return this.parseFunctionStatement(node, true, !context);
    }

    var maybeName = this.value, expr = this.parseExpression();
    return starttype === types$1.name && expr.type === "Identifier" && this.eat(types$1.colon)
      ? this.parseLabeledStatement(node, maybeName, expr, context)
      : this.parseExpressionStatement(node, expr);
  }
};

pp.parseBreakContinueStatement = function(node, keyword) {
  var isBreak = keyword === "break";
  this.next();
  if (this.eat(types$1.semi) || this.insertSemicolon()) node.label = null;
  else if (this.type !== types$1.name) this.unexpected();
  else {
    node.label = this.parseIdent();
    this.semicolon();
  }

  var i = 0;
  for (; i < this.labels.length; ++i) {
    var lab = this.labels[i];
    if (node.label == null || lab.name === node.label.name)
      if ((lab.kind != null && (isBreak || lab.kind === "loop")) || (node.label && isBreak)) break;
  }
  i !== this.labels.length || this.raise(node.start, "Unsyntactic " + keyword);
  return this.finishNode(node, isBreak ? "BreakStatement" : "ContinueStatement");
};

pp.parseDebuggerStatement = function(node) {
  this.next();
  this.semicolon();
  return this.finishNode(node, "DebuggerStatement");
};

pp.parseDoStatement = function(node) {
  this.next();
  this.labels.push(loopLabel);
  node.body = this.parseStatement("do");
  this.labels.pop();
  this.expect(types$1._while);
  node.test = this.parseParenExpression();
  this.options.ecmaVersion >= 6 ? this.eat(types$1.semi) : this.semicolon();
  return this.finishNode(node, "DoWhileStatement");
};

pp.parseForStatement = function(node) {
  this.next();
  var awaitAt = this.options.ecmaVersion >= 9 && this.canAwait && this.eatContextual("await") ? this.lastTokStart : -1;
  this.labels.push(loopLabel);
  this.enterScope(0);
  this.expect(types$1.parenL);
  if (this.type === types$1.semi) {
    awaitAt > -1 && this.unexpected(awaitAt);
    return this.parseFor(node, null);
  }
  var isLet = this.isLet();
  if (this.type === types$1._var || this.type === types$1._const || isLet) {
    var init$1 = this.startNode(), kind = isLet ? "let" : this.value;
    this.next();
    this.parseVar(init$1, true, kind);
    this.finishNode(init$1, "VariableDeclaration");
    if ((this.type === types$1._in || (this.options.ecmaVersion >= 6 && this.isContextual("of"))) && init$1.declarations.length === 1) {
      if (this.options.ecmaVersion >= 9)
        this.type === types$1._in ? awaitAt > -1 && this.unexpected(awaitAt) : (node.await = awaitAt > -1);

      return this.parseForIn(node, init$1);
    }
    awaitAt > -1 && this.unexpected(awaitAt);
    return this.parseFor(node, init$1);
  }
  var startsWithLet = this.isContextual("let"), isForOf = false,
    refDestructuringErrors = new DestructuringErrors(),
    init = this.parseExpression(awaitAt < 0 || "await", refDestructuringErrors);
  if (this.type === types$1._in || (isForOf = this.options.ecmaVersion >= 6 && this.isContextual("of"))) {
    if (this.options.ecmaVersion >= 9)
      this.type === types$1._in ? awaitAt > -1 && this.unexpected(awaitAt) : (node.await = awaitAt > -1);

    startsWithLet && isForOf && this.raise(init.start, "The left-hand side of a for-of loop may not start with 'let'.");
    this.toAssignable(init, false, refDestructuringErrors);
    this.checkLValPattern(init);
    return this.parseForIn(node, init);
  }
  this.checkExpressionErrors(refDestructuringErrors, true);

  awaitAt > -1 && this.unexpected(awaitAt);
  return this.parseFor(node, init);
};

pp.parseFunctionStatement = function(node, isAsync, declarationPosition) {
  this.next();
  return this.parseFunction(node, FUNC_STATEMENT | (declarationPosition ? 0 : FUNC_HANGING_STATEMENT), false, isAsync);
};

pp.parseIfStatement = function(node) {
  this.next();
  node.test = this.parseParenExpression();
  node.consequent = this.parseStatement("if");
  node.alternate = this.eat(types$1._else) ? this.parseStatement("if") : null;
  return this.finishNode(node, "IfStatement");
};

pp.parseReturnStatement = function(node) {
  this.inFunction || this.options.allowReturnOutsideFunction || this.raise(this.start, "'return' outside of function");
  this.next();

  if (this.eat(types$1.semi) || this.insertSemicolon()) node.argument = null;
  else {
    node.argument = this.parseExpression();
    this.semicolon();
  }
  return this.finishNode(node, "ReturnStatement");
};

pp.parseSwitchStatement = function(node) {
  this.next();
  node.discriminant = this.parseParenExpression();
  node.cases = [];
  this.expect(types$1.braceL);
  this.labels.push(switchLabel);
  this.enterScope(0);

  var cur;
  for (var sawDefault = false; this.type !== types$1.braceR; )
    if (this.type === types$1._case || this.type === types$1._default) {
      var isCase = this.type === types$1._case;
      cur && this.finishNode(cur, "SwitchCase");
      node.cases.push((cur = this.startNode()));
      cur.consequent = [];
      this.next();
      if (isCase) cur.test = this.parseExpression();
      else {
        sawDefault && this.raiseRecoverable(this.lastTokStart, "Multiple default clauses");
        sawDefault = true;
        cur.test = null;
      }
      this.expect(types$1.colon);
    } else {
      cur || this.unexpected();
      cur.consequent.push(this.parseStatement(null));
    }

  this.exitScope();
  cur && this.finishNode(cur, "SwitchCase");
  this.next();
  this.labels.pop();
  return this.finishNode(node, "SwitchStatement");
};

pp.parseThrowStatement = function(node) {
  this.next();
  lineBreak.test(this.input.slice(this.lastTokEnd, this.start)) && this.raise(this.lastTokEnd, "Illegal newline after throw");
  node.argument = this.parseExpression();
  this.semicolon();
  return this.finishNode(node, "ThrowStatement");
};

var empty$1 = [];

pp.parseCatchClauseParam = function() {
  var param = this.parseBindingAtom(),
    simple = param.type === "Identifier";
  this.enterScope(simple ? SCOPE_SIMPLE_CATCH : 0);
  this.checkLValPattern(param, simple ? BIND_SIMPLE_CATCH : BIND_LEXICAL);
  this.expect(types$1.parenR);

  return param;
};

pp.parseTryStatement = function(node) {
  this.next();
  node.block = this.parseBlock();
  node.handler = null;
  if (this.type === types$1._catch) {
    var clause = this.startNode();
    this.next();
    if (this.eat(types$1.parenL)) clause.param = this.parseCatchClauseParam();
    else {
      this.options.ecmaVersion < 10 && this.unexpected();
      clause.param = null;
      this.enterScope(0);
    }
    clause.body = this.parseBlock(false);
    this.exitScope();
    node.handler = this.finishNode(clause, "CatchClause");
  }
  node.finalizer = this.eat(types$1._finally) ? this.parseBlock() : null;
  node.handler || node.finalizer || this.raise(node.start, "Missing catch or finally clause");
  return this.finishNode(node, "TryStatement");
};

pp.parseVarStatement = function(node, kind, allowMissingInitializer) {
  this.next();
  this.parseVar(node, false, kind, allowMissingInitializer);
  this.semicolon();
  return this.finishNode(node, "VariableDeclaration");
};

pp.parseWhileStatement = function(node) {
  this.next();
  node.test = this.parseParenExpression();
  this.labels.push(loopLabel);
  node.body = this.parseStatement("while");
  this.labels.pop();
  return this.finishNode(node, "WhileStatement");
};

pp.parseWithStatement = function(node) {
  this.strict && this.raise(this.start, "'with' in strict mode");
  this.next();
  node.object = this.parseParenExpression();
  node.body = this.parseStatement("with");
  return this.finishNode(node, "WithStatement");
};

pp.parseEmptyStatement = function(node) {
  this.next();
  return this.finishNode(node, "EmptyStatement");
};

pp.parseLabeledStatement = function(node, maybeName, expr, context) {
  for (var i$1 = 0, list = this.labels; i$1 < list.length; i$1++)
    list[i$1].name !== maybeName || this.raise(expr.start, "Label '" + maybeName + "' is already declared");

  var kind = this.type.isLoop ? "loop" : this.type === types$1._switch ? "switch" : null;
  for (var i = this.labels.length - 1; i >= 0; i--) {
    var label$1 = this.labels[i];
    if (label$1.statementStart !== node.start) break;

    label$1.statementStart = this.start;
    label$1.kind = kind;
  }
  this.labels.push({name: maybeName, kind: kind, statementStart: this.start});
  node.body = this.parseStatement(context ? (context.indexOf("label") < 0 ? context + "label" : context) : "label");
  this.labels.pop();
  node.label = expr;
  return this.finishNode(node, "LabeledStatement");
};

pp.parseExpressionStatement = function(node, expr) {
  node.expression = expr;
  this.semicolon();
  return this.finishNode(node, "ExpressionStatement");
};

pp.parseBlock = function(createNewLexicalScope, node, exitStrict) {
  if (createNewLexicalScope === void 0) createNewLexicalScope = true;
  if (node === void 0) node = this.startNode();

  node.body = [];
  this.expect(types$1.braceL);
  createNewLexicalScope && this.enterScope(0);
  while (this.type !== types$1.braceR) {
    var stmt = this.parseStatement(null);
    node.body.push(stmt);
  }
  if (exitStrict) this.strict = false;
  this.next();
  createNewLexicalScope && this.exitScope();
  return this.finishNode(node, "BlockStatement");
};

pp.parseFor = function(node, init) {
  node.init = init;
  this.expect(types$1.semi);
  node.test = this.type === types$1.semi ? null : this.parseExpression();
  this.expect(types$1.semi);
  node.update = this.type === types$1.parenR ? null : this.parseExpression();
  this.expect(types$1.parenR);
  node.body = this.parseStatement("for");
  this.exitScope();
  this.labels.pop();
  return this.finishNode(node, "ForStatement");
};

pp.parseForIn = function(node, init) {
  var isForIn = this.type === types$1._in;
  this.next();

  init.type === "VariableDeclaration" &&
    init.declarations[0].init != null &&
    (!isForIn || this.options.ecmaVersion < 8 || this.strict || init.kind !== "var" || init.declarations[0].id.type !== "Identifier") &&
    this.raise(init.start, (isForIn ? "for-in" : "for-of") + " loop variable declaration may not have an initializer");

  node.left = init;
  node.right = isForIn ? this.parseExpression() : this.parseMaybeAssign();
  this.expect(types$1.parenR);
  node.body = this.parseStatement("for");
  this.exitScope();
  this.labels.pop();
  return this.finishNode(node, isForIn ? "ForInStatement" : "ForOfStatement");
};

pp.parseVar = function(node, isFor, kind, allowMissingInitializer) {
  node.declarations = [];
  node.kind = kind;
  for (;;) {
    var decl = this.startNode();
    this.parseVarId(decl, kind);
    this.eat(types$1.eq)
      ? (decl.init = this.parseMaybeAssign(isFor))
      : allowMissingInitializer || kind !== "const" ||
        this.type === types$1._in || (this.options.ecmaVersion >= 6 && this.isContextual("of"))
      ? allowMissingInitializer || decl.id.type === "Identifier" || (isFor && (this.type === types$1._in || this.isContextual("of")))
        ? (decl.init = null)
        : this.raise(this.lastTokEnd, "Complex binding patterns require an initialization value")
      : this.unexpected();

    node.declarations.push(this.finishNode(decl, "VariableDeclarator"));
    if (!this.eat(types$1.comma)) break;
  }
  return node;
};

pp.parseVarId = function(decl, kind) {
  decl.id = this.parseBindingAtom();
  this.checkLValPattern(decl.id, kind === "var" ? BIND_VAR : BIND_LEXICAL, false);
};

var FUNC_STATEMENT = 1, FUNC_HANGING_STATEMENT = 2, FUNC_NULLABLE_ID = 4;

pp.parseFunction = function(node, statement, allowExpressionBody, isAsync, forInit) {
  this.initFunction(node);
  if (this.options.ecmaVersion >= 9 || (this.options.ecmaVersion >= 6 && !isAsync)) {
    this.type === types$1.star && statement & FUNC_HANGING_STATEMENT && this.unexpected();
    node.generator = this.eat(types$1.star);
  }
  if (this.options.ecmaVersion >= 8) node.async = !!isAsync;

  if (statement & FUNC_STATEMENT) {
    node.id = statement & FUNC_NULLABLE_ID && this.type !== types$1.name ? null : this.parseIdent();
    !node.id || statement & FUNC_HANGING_STATEMENT ||
      this.checkLValSimple(
        node.id,
        this.strict || node.generator || node.async ? (this.treatFunctionsAsVar ? BIND_VAR : BIND_LEXICAL) : BIND_FUNCTION
      );
  }

  var oldYieldPos = this.yieldPos, oldAwaitPos = this.awaitPos, oldAwaitIdentPos = this.awaitIdentPos;
  this.yieldPos = 0;
  this.awaitPos = 0;
  this.awaitIdentPos = 0;
  this.enterScope(functionFlags(node.async, node.generator));

  statement & FUNC_STATEMENT || (node.id = this.type === types$1.name ? this.parseIdent() : null);

  this.parseFunctionParams(node);
  this.parseFunctionBody(node, allowExpressionBody, false, forInit);

  this.yieldPos = oldYieldPos;
  this.awaitPos = oldAwaitPos;
  this.awaitIdentPos = oldAwaitIdentPos;
  return this.finishNode(node, statement & FUNC_STATEMENT ? "FunctionDeclaration" : "FunctionExpression");
};

pp.parseFunctionParams = function(node) {
  this.expect(types$1.parenL);
  node.params = this.parseBindingList(types$1.parenR, false, this.options.ecmaVersion >= 8);
  this.checkYieldAwaitInDefaultParams();
};

pp.parseClass = function(node, isStatement) {
  this.next();

  var oldStrict = this.strict;
  this.strict = true;

  this.parseClassId(node, isStatement);
  this.parseClassSuper(node);
  var privateNameMap = this.enterClassBody(),
    classBody = this.startNode(),
    hadConstructor = false;
  classBody.body = [];
  this.expect(types$1.braceL);
  while (this.type !== types$1.braceR) {
    var element = this.parseClassElement(node.superClass !== null);
    if (element) {
      classBody.body.push(element);
      if (element.type === "MethodDefinition" && element.kind === "constructor") {
        hadConstructor && this.raiseRecoverable(element.start, "Duplicate constructor in the same class");
        hadConstructor = true;
      } else
        element.key && element.key.type === "PrivateIdentifier" && isPrivateNameConflicted(privateNameMap, element) &&
          this.raiseRecoverable(element.key.start, "Identifier '#" + element.key.name + "' has already been declared");
    }
  }
  this.strict = oldStrict;
  this.next();
  node.body = this.finishNode(classBody, "ClassBody");
  this.exitClassBody();
  return this.finishNode(node, isStatement ? "ClassDeclaration" : "ClassExpression");
};

pp.parseClassElement = function(constructorAllowsSuper) {
  if (this.eat(types$1.semi)) return null;

  var ecmaVersion = this.options.ecmaVersion,
    node = this.startNode(),
    keyName = "",
    isGenerator = false,
    isAsync = false,
    kind = "method",
    isStatic = false;

  if (this.eatContextual("static")) {
    if (ecmaVersion >= 13 && this.eat(types$1.braceL)) {
      this.parseClassStaticBlock(node);
      return node;
    }
    this.isClassElementNameStart() || this.type === types$1.star ? (isStatic = true) : (keyName = "static");
  }
  node.static = isStatic;
  if (!keyName && ecmaVersion >= 8 && this.eatContextual("async"))
    (this.isClassElementNameStart() || this.type === types$1.star) && !this.canInsertSemicolon()
      ? (isAsync = true)
      : (keyName = "async");

  keyName || (ecmaVersion < 9 && isAsync) || !this.eat(types$1.star) || (isGenerator = true);

  if (!keyName && !isAsync && !isGenerator) {
    var lastValue = this.value;
    if (this.eatContextual("get") || this.eatContextual("set"))
      this.isClassElementNameStart() ? (kind = lastValue) : (keyName = lastValue);
  }

  if (keyName) {
    node.computed = false;
    node.key = this.startNodeAt(this.lastTokStart, this.lastTokStartLoc);
    node.key.name = keyName;
    this.finishNode(node.key, "Identifier");
  } else this.parseClassElementName(node);

  if (ecmaVersion < 13 || this.type === types$1.parenL || kind !== "method" || isGenerator || isAsync) {
    var isConstructor = !node.static && checkKeyName(node, "constructor"),
      allowsDirectSuper = isConstructor && constructorAllowsSuper;
    isConstructor && kind !== "method" && this.raise(node.key.start, "Constructor can't have get/set modifier");
    node.kind = isConstructor ? "constructor" : kind;
    this.parseClassMethod(node, isGenerator, isAsync, allowsDirectSuper);
  } else this.parseClassField(node);

  return node;
};

pp.isClassElementNameStart = function() {
  return (
    this.type === types$1.name ||
    this.type === types$1.privateId ||
    this.type === types$1.num ||
    this.type === types$1.string ||
    this.type === types$1.bracketL ||
    this.type.keyword
  );
};

pp.parseClassElementName = function(element) {
  if (this.type === types$1.privateId) {
    this.value !== "constructor" || this.raise(this.start, "Classes can't have an element named '#constructor'");

    element.computed = false;
    element.key = this.parsePrivateIdent();
  } else this.parsePropertyName(element);
};

pp.parseClassMethod = function(method, isGenerator, isAsync, allowsDirectSuper) {
  var key = method.key;
  if (method.kind === "constructor") {
    isGenerator && this.raise(key.start, "Constructor can't be a generator");
    isAsync && this.raise(key.start, "Constructor can't be an async method");
  } else
    method.static && checkKeyName(method, "prototype") &&
      this.raise(key.start, "Classes may not have a static property named prototype");

  var value = (method.value = this.parseMethod(isGenerator, isAsync, allowsDirectSuper));

  method.kind !== "get" || value.params.length === 0 || this.raiseRecoverable(value.start, "getter should have no params");
  method.kind !== "set" || value.params.length === 1 || this.raiseRecoverable(value.start, "setter should have exactly one param");
  method.kind !== "set" || value.params[0].type !== "RestElement" ||
    this.raiseRecoverable(value.params[0].start, "Setter cannot use rest params");

  return this.finishNode(method, "MethodDefinition");
};

pp.parseClassField = function(field) {
  checkKeyName(field, "constructor")
    ? this.raise(field.key.start, "Classes can't have a field named 'constructor'")
    : field.static && checkKeyName(field, "prototype") &&
      this.raise(field.key.start, "Classes can't have a static field named 'prototype'");

  if (this.eat(types$1.eq)) {
    var scope = this.currentThisScope(),
      inClassFieldInit = scope.inClassFieldInit;
    scope.inClassFieldInit = true;
    field.value = this.parseMaybeAssign();
    scope.inClassFieldInit = inClassFieldInit;
  } else field.value = null;

  this.semicolon();

  return this.finishNode(field, "PropertyDefinition");
};

pp.parseClassStaticBlock = function(node) {
  node.body = [];

  var oldLabels = this.labels;
  this.labels = [];
  this.enterScope(SCOPE_CLASS_STATIC_BLOCK | SCOPE_SUPER);
  while (this.type !== types$1.braceR) {
    var stmt = this.parseStatement(null);
    node.body.push(stmt);
  }
  this.next();
  this.exitScope();
  this.labels = oldLabels;

  return this.finishNode(node, "StaticBlock");
};

pp.parseClassId = function(node, isStatement) {
  if (this.type === types$1.name) {
    node.id = this.parseIdent();
    isStatement && this.checkLValSimple(node.id, BIND_LEXICAL, false);
  } else {
    isStatement !== true || this.unexpected();
    node.id = null;
  }
};

pp.parseClassSuper = function(node) {
  node.superClass = this.eat(types$1._extends) ? this.parseExprSubscripts(null, false) : null;
};

pp.enterClassBody = function() {
  var element = {declared: Object.create(null), used: []};
  this.privateNameStack.push(element);
  return element.declared;
};

pp.exitClassBody = function() {
  var ref = this.privateNameStack.pop(),
    declared = ref.declared,
    used = ref.used;
  if (!this.options.checkPrivateFields) return;
  var len = this.privateNameStack.length;
  for (var parent = len === 0 ? null : this.privateNameStack[len - 1], i = 0; i < used.length; ++i) {
    var id = used[i];
    if (!hasOwn(declared, id.name))
      parent
        ? parent.used.push(id)
        : this.raiseRecoverable(id.start, "Private field '#" + id.name + "' must be declared in an enclosing class");
  }
};

function isPrivateNameConflicted(privateNameMap, element) {
  var name = element.key.name,
    curr = privateNameMap[name],

    next = "true";
  if (element.type === "MethodDefinition" && (element.kind === "get" || element.kind === "set"))
    next = (element.static ? "s" : "i") + element.kind;

  if (
    (curr === "iget" && next === "iset") ||
    (curr === "iset" && next === "iget") ||
    (curr === "sget" && next === "sset") ||
    (curr === "sset" && next === "sget")
  ) {
    privateNameMap[name] = "true";
    return false;
  }
  if (curr) return true;

  privateNameMap[name] = next;
  return false;
}

function checkKeyName(node, name) {
  var computed = node.computed,
    key = node.key;
  return !computed && ((key.type === "Identifier" && key.name === name) || (key.type === "Literal" && key.value === name));
}

pp.parseExportAllDeclaration = function(node, exports) {
  if (this.options.ecmaVersion >= 11)
    if (this.eatContextual("as")) {
      node.exported = this.parseModuleExportName();
      this.checkExport(exports, node.exported, this.lastTokStart);
    } else node.exported = null;

  this.expectContextual("from");
  this.type === types$1.string || this.unexpected();
  node.source = this.parseExprAtom();
  this.semicolon();
  return this.finishNode(node, "ExportAllDeclaration");
};

pp.parseExport = function(node, exports) {
  this.next();
  if (this.eat(types$1.star)) return this.parseExportAllDeclaration(node, exports);

  if (this.eat(types$1._default)) {
    this.checkExport(exports, "default", this.lastTokStart);
    node.declaration = this.parseExportDefaultDeclaration();
    return this.finishNode(node, "ExportDefaultDeclaration");
  }
  if (this.shouldParseExportStatement()) {
    node.declaration = this.parseExportDeclaration(node);
    node.declaration.type === "VariableDeclaration"
      ? this.checkVariableExport(exports, node.declaration.declarations)
      : this.checkExport(exports, node.declaration.id, node.declaration.id.start);
    node.specifiers = [];
    node.source = null;
  } else {
    node.declaration = null;
    node.specifiers = this.parseExportSpecifiers(exports);
    if (this.eatContextual("from")) {
      this.type === types$1.string || this.unexpected();
      node.source = this.parseExprAtom();
    } else {
      for (var i = 0, list = node.specifiers; i < list.length; i++) {
        var spec = list[i];

        this.checkUnreserved(spec.local);
        this.checkLocalExport(spec.local);

        spec.local.type !== "Literal" ||
          this.raise(spec.local.start, "A string literal cannot be used as an exported binding without `from`.");
      }

      node.source = null;
    }
    this.semicolon();
  }
  return this.finishNode(node, "ExportNamedDeclaration");
};

pp.parseExportDeclaration = function(_node) {
  return this.parseStatement(null);
};

pp.parseExportDefaultDeclaration = function() {
  var isAsync;
  if (this.type === types$1._function || (isAsync = this.isAsyncFunction())) {
    var fNode = this.startNode();
    this.next();
    isAsync && this.next();
    return this.parseFunction(fNode, FUNC_STATEMENT | FUNC_NULLABLE_ID, false, isAsync);
  }
  if (this.type === types$1._class) {
    var cNode = this.startNode();
    return this.parseClass(cNode, "nullableID");
  }
  var declaration = this.parseMaybeAssign();
  this.semicolon();
  return declaration;
};

pp.checkExport = function(exports, name, pos) {
  if (!exports) return;
  if (typeof name != "string") name = name.type === "Identifier" ? name.name : name.value;
  hasOwn(exports, name) && this.raiseRecoverable(pos, "Duplicate export '" + name + "'");
  exports[name] = true;
};

pp.checkPatternExport = function(exports, pat) {
  var type = pat.type;
  if (type === "Identifier") this.checkExport(exports, pat, pat.start);
  else if (type === "ObjectPattern")
    for (var i = 0, list = pat.properties; i < list.length; i++) {
      var prop = list[i];

      this.checkPatternExport(exports, prop);
    }
  else if (type === "ArrayPattern")
    for (var i$1 = 0, list$1 = pat.elements; i$1 < list$1.length; i$1++) {
      var elt = list$1[i$1];

      elt && this.checkPatternExport(exports, elt);
    }
  else type === "Property"
    ? this.checkPatternExport(exports, pat.value)
    : type === "AssignmentPattern"
    ? this.checkPatternExport(exports, pat.left)
    : type !== "RestElement" || this.checkPatternExport(exports, pat.argument);
};

pp.checkVariableExport = function(exports, decls) {
  if (!exports) return;
  for (var i = 0, list = decls; i < list.length; i++) {
    var decl = list[i];

    this.checkPatternExport(exports, decl.id);
  }
};

pp.shouldParseExportStatement = function() {
  return (
    this.type.keyword === "var" ||
    this.type.keyword === "const" ||
    this.type.keyword === "class" ||
    this.type.keyword === "function" ||
    this.isLet() ||
    this.isAsyncFunction()
  );
};

pp.parseExportSpecifier = function(exports) {
  var node = this.startNode();
  node.local = this.parseModuleExportName();

  node.exported = this.eatContextual("as") ? this.parseModuleExportName() : node.local;
  this.checkExport(exports, node.exported, node.exported.start);

  return this.finishNode(node, "ExportSpecifier");
};

pp.parseExportSpecifiers = function(exports) {
  var nodes = [], first = true;
  this.expect(types$1.braceL);
  while (!this.eat(types$1.braceR)) {
    if (!first) {
      this.expect(types$1.comma);
      if (this.afterTrailingComma(types$1.braceR)) break;
    } else first = false;

    nodes.push(this.parseExportSpecifier(exports));
  }
  return nodes;
};

pp.parseImport = function(node) {
  this.next();

  if (this.type === types$1.string) {
    node.specifiers = empty$1;
    node.source = this.parseExprAtom();
  } else {
    node.specifiers = this.parseImportSpecifiers();
    this.expectContextual("from");
    node.source = this.type === types$1.string ? this.parseExprAtom() : this.unexpected();
  }
  this.semicolon();
  return this.finishNode(node, "ImportDeclaration");
};

pp.parseImportSpecifier = function() {
  var node = this.startNode();
  node.imported = this.parseModuleExportName();

  if (this.eatContextual("as")) node.local = this.parseIdent();
  else {
    this.checkUnreserved(node.imported);
    node.local = node.imported;
  }
  this.checkLValSimple(node.local, BIND_LEXICAL);

  return this.finishNode(node, "ImportSpecifier");
};

pp.parseImportDefaultSpecifier = function() {
  var node = this.startNode();
  node.local = this.parseIdent();
  this.checkLValSimple(node.local, BIND_LEXICAL);
  return this.finishNode(node, "ImportDefaultSpecifier");
};

pp.parseImportNamespaceSpecifier = function() {
  var node = this.startNode();
  this.next();
  this.expectContextual("as");
  node.local = this.parseIdent();
  this.checkLValSimple(node.local, BIND_LEXICAL);
  return this.finishNode(node, "ImportNamespaceSpecifier");
};

pp.parseImportSpecifiers = function() {
  var nodes = [], first = true;
  if (this.type === types$1.name) {
    nodes.push(this.parseImportDefaultSpecifier());
    if (!this.eat(types$1.comma)) return nodes;
  }
  if (this.type === types$1.star) {
    nodes.push(this.parseImportNamespaceSpecifier());
    return nodes;
  }
  this.expect(types$1.braceL);
  while (!this.eat(types$1.braceR)) {
    if (!first) {
      this.expect(types$1.comma);
      if (this.afterTrailingComma(types$1.braceR)) break;
    } else first = false;

    nodes.push(this.parseImportSpecifier());
  }
  return nodes;
};

pp.parseModuleExportName = function() {
  if (this.options.ecmaVersion >= 13 && this.type === types$1.string) {
    var stringLiteral = this.parseLiteral(this.value);
    loneSurrogate.test(stringLiteral.value) && this.raise(stringLiteral.start, "An export name cannot include a lone surrogate.");

    return stringLiteral;
  }
  return this.parseIdent(true);
};

pp.adaptDirectivePrologue = function(statements) {
  for (var i = 0; i < statements.length && this.isDirectiveCandidate(statements[i]); ++i)
    statements[i].directive = statements[i].expression.raw.slice(1, -1);
};
pp.isDirectiveCandidate = function(statement) {
  return (
    this.options.ecmaVersion >= 5 &&
    statement.type === "ExpressionStatement" &&
    statement.expression.type === "Literal" &&
    typeof statement.expression.value == "string" &&
    (this.input[statement.start] === '"' || this.input[statement.start] === "'")
  );
};

pp.toAssignable = function(node, isBinding, refDestructuringErrors) {
  if (this.options.ecmaVersion >= 6 && node)
    switch (node.type) {
    case "Identifier":
      this.inAsync && node.name === "await" && this.raise(node.start, "Cannot use 'await' as identifier inside an async function");
      break;

    case "ObjectPattern":
    case "ArrayPattern":
    case "AssignmentPattern":
    case "RestElement":
      break;

    case "ObjectExpression":
      node.type = "ObjectPattern";
      refDestructuringErrors && this.checkPatternErrors(refDestructuringErrors, true);
      for (var i = 0, list = node.properties; i < list.length; i++) {
        var prop = list[i];

        this.toAssignable(prop, isBinding);

        prop.type !== "RestElement" ||
          (prop.argument.type !== "ArrayPattern" && prop.argument.type !== "ObjectPattern") ||
          this.raise(prop.argument.start, "Unexpected token");
      }
      break;

    case "Property":
      node.kind === "init" || this.raise(node.key.start, "Object pattern can't contain getter or setter");
      this.toAssignable(node.value, isBinding);
      break;

    case "ArrayExpression":
      node.type = "ArrayPattern";
      refDestructuringErrors && this.checkPatternErrors(refDestructuringErrors, true);
      this.toAssignableList(node.elements, isBinding);
      break;

    case "SpreadElement":
      node.type = "RestElement";
      this.toAssignable(node.argument, isBinding);
      node.argument.type !== "AssignmentPattern" || this.raise(node.argument.start, "Rest elements cannot have a default value");
      break;

    case "AssignmentExpression":
      node.operator === "=" || this.raise(node.left.end, "Only '=' operator can be used for specifying default value.");
      node.type = "AssignmentPattern";
      delete node.operator;
      this.toAssignable(node.left, isBinding);
      break;

    case "ParenthesizedExpression":
      this.toAssignable(node.expression, isBinding, refDestructuringErrors);
      break;

    case "ChainExpression":
      this.raiseRecoverable(node.start, "Optional chaining cannot appear in left-hand side");
      break;

    case "MemberExpression":
      if (!isBinding) break;

    default:
      this.raise(node.start, "Assigning to rvalue");
    }
  else refDestructuringErrors && this.checkPatternErrors(refDestructuringErrors, true);
  return node;
};

pp.toAssignableList = function(exprList, isBinding) {
  var end = exprList.length;
  for (var i = 0; i < end; i++) {
    var elt = exprList[i];
    elt && this.toAssignable(elt, isBinding);
  }
  if (end) {
    var last = exprList[end - 1];
    this.options.ecmaVersion === 6 && isBinding && last && last.type === "RestElement" && last.argument.type !== "Identifier" &&
      this.unexpected(last.argument.start);
  }
  return exprList;
};

pp.parseSpread = function(refDestructuringErrors) {
  var node = this.startNode();
  this.next();
  node.argument = this.parseMaybeAssign(false, refDestructuringErrors);
  return this.finishNode(node, "SpreadElement");
};

pp.parseRestBinding = function() {
  var node = this.startNode();
  this.next();

  this.options.ecmaVersion === 6 && this.type !== types$1.name && this.unexpected();

  node.argument = this.parseBindingAtom();

  return this.finishNode(node, "RestElement");
};

pp.parseBindingAtom = function() {
  if (this.options.ecmaVersion >= 6)
    switch (this.type) {
    case types$1.bracketL:
      var node = this.startNode();
      this.next();
      node.elements = this.parseBindingList(types$1.bracketR, true, true);
      return this.finishNode(node, "ArrayPattern");

    case types$1.braceL:
      return this.parseObj(true);
    }

  return this.parseIdent();
};

pp.parseBindingList = function(close, allowEmpty, allowTrailingComma, allowModifiers) {
  var elts = [], first = true;
  while (!this.eat(close)) {
    first ? (first = false) : this.expect(types$1.comma);
    if (allowEmpty && this.type === types$1.comma) elts.push(null);
    else if (allowTrailingComma && this.afterTrailingComma(close)) break;
    else if (this.type === types$1.ellipsis) {
      var rest = this.parseRestBinding();
      this.parseBindingListItem(rest);
      elts.push(rest);
      this.type !== types$1.comma || this.raiseRecoverable(this.start, "Comma is not permitted after the rest element");
      this.expect(close);
      break;
    } else elts.push(this.parseAssignableListItem(allowModifiers));
  }
  return elts;
};

pp.parseAssignableListItem = function(_allowModifiers) {
  var elem = this.parseMaybeDefault(this.start, this.startLoc);
  this.parseBindingListItem(elem);
  return elem;
};

pp.parseBindingListItem = function(param) {
  return param;
};

pp.parseMaybeDefault = function(startPos, startLoc, left) {
  left = left || this.parseBindingAtom();
  if (this.options.ecmaVersion < 6 || !this.eat(types$1.eq)) return left;
  var node = this.startNodeAt(startPos, startLoc);
  node.left = left;
  node.right = this.parseMaybeAssign();
  return this.finishNode(node, "AssignmentPattern");
};

pp.checkLValSimple = function(expr, bindingType, checkClashes) {
  if (bindingType === void 0) bindingType = BIND_NONE;

  var isBind = bindingType !== BIND_NONE;

  switch (expr.type) {
  case "Identifier":
    this.strict && this.reservedWordsStrictBind.test(expr.name) &&
      this.raiseRecoverable(expr.start, (isBind ? "Binding " : "Assigning to ") + expr.name + " in strict mode");
    if (isBind) {
      bindingType !== BIND_LEXICAL || expr.name !== "let" ||
        this.raiseRecoverable(expr.start, "let is disallowed as a lexically bound name");
      if (checkClashes) {
        hasOwn(checkClashes, expr.name) && this.raiseRecoverable(expr.start, "Argument name clash");
        checkClashes[expr.name] = true;
      }
      bindingType === BIND_OUTSIDE || this.declareName(expr.name, bindingType, expr.start);
    }
    break;

  case "ChainExpression":
    this.raiseRecoverable(expr.start, "Optional chaining cannot appear in left-hand side");
    break;

  case "MemberExpression":
    isBind && this.raiseRecoverable(expr.start, "Binding member expression");
    break;

  case "ParenthesizedExpression":
    isBind && this.raiseRecoverable(expr.start, "Binding parenthesized expression");
    return this.checkLValSimple(expr.expression, bindingType, checkClashes);

  default:
    this.raise(expr.start, (isBind ? "Binding" : "Assigning to") + " rvalue");
  }
};

pp.checkLValPattern = function(expr, bindingType, checkClashes) {
  if (bindingType === void 0) bindingType = BIND_NONE;

  switch (expr.type) {
  case "ObjectPattern":
    for (var i = 0, list = expr.properties; i < list.length; i++) {
      var prop = list[i];

      this.checkLValInnerPattern(prop, bindingType, checkClashes);
    }
    break;

  case "ArrayPattern":
    for (var i$1 = 0, list$1 = expr.elements; i$1 < list$1.length; i$1++) {
      var elem = list$1[i$1];

      elem && this.checkLValInnerPattern(elem, bindingType, checkClashes);
    }
    break;

  default:
    this.checkLValSimple(expr, bindingType, checkClashes);
  }
};

pp.checkLValInnerPattern = function(expr, bindingType, checkClashes) {
  if (bindingType === void 0) bindingType = BIND_NONE;

  switch (expr.type) {
  case "Property":
    this.checkLValInnerPattern(expr.value, bindingType, checkClashes);
    break;

  case "AssignmentPattern":
    this.checkLValPattern(expr.left, bindingType, checkClashes);
    break;

  case "RestElement":
    this.checkLValPattern(expr.argument, bindingType, checkClashes);
    break;

  default:
    this.checkLValPattern(expr, bindingType, checkClashes);
  }
};

function TokContext(token, isExpr, preserveSpace, override, generator) {
  this.token = token;
  this.isExpr = !!isExpr;
  this.preserveSpace = !!preserveSpace;
  this.override = override;
  this.generator = !!generator;
}

var types = {
  b_stat: new TokContext("{", false),
  b_expr: new TokContext("{", true),
  b_tmpl: new TokContext("${", false),
  p_stat: new TokContext("(", false),
  p_expr: new TokContext("(", true),
  q_tmpl: new TokContext("`", true, true, function(p) { return p.tryReadTemplateToken(); }),
  f_stat: new TokContext("function", false),
  f_expr: new TokContext("function", true),
  f_expr_gen: new TokContext("function", true, false, null, true),
  f_gen: new TokContext("function", false, false, null, true)
};

pp.initialContext = function() {
  return [types.b_stat];
};

pp.curContext = function() {
  return this.context[this.context.length - 1];
};

pp.braceIsBlock = function(prevType) {
  var parent = this.curContext();
  return parent === types.f_expr || parent === types.f_stat || (
    prevType === types$1.colon && (parent === types.b_stat || parent === types.b_expr)
      ? !parent.isExpr
      : prevType === types$1._return || (prevType === types$1.name && this.exprAllowed)
      ? lineBreak.test(this.input.slice(this.lastTokEnd, this.start))
      : prevType === types$1._else ||
        prevType === types$1.semi ||
        prevType === types$1.eof ||
        prevType === types$1.parenR ||
        prevType === types$1.arrow ||
        (prevType === types$1.braceL
          ? parent === types.b_stat
          : prevType !== types$1._var && prevType !== types$1._const && prevType !== types$1.name && !this.exprAllowed)
  );
};

pp.inGeneratorContext = function() {
  for (var i = this.context.length - 1; i >= 1; i--) {
    var context = this.context[i];
    if (context.token === "function") return context.generator;
  }
  return false;
};

pp.updateContext = function(prevType) {
  var update, type = this.type;
  type.keyword && prevType === types$1.dot
    ? (this.exprAllowed = false)
    : (update = type.updateContext)
    ? update.call(this, prevType)
    : (this.exprAllowed = type.beforeExpr);
};

pp.overrideContext = function(tokenCtx) {
  if (this.curContext() !== tokenCtx) this.context[this.context.length - 1] = tokenCtx;
};

types$1.parenR.updateContext = types$1.braceR.updateContext = function() {
  if (this.context.length === 1) {
    this.exprAllowed = true;
    return;
  }
  var out = this.context.pop();
  if (out === types.b_stat && this.curContext().token === "function") out = this.context.pop();

  this.exprAllowed = !out.isExpr;
};

types$1.braceL.updateContext = function(prevType) {
  this.context.push(this.braceIsBlock(prevType) ? types.b_stat : types.b_expr);
  this.exprAllowed = true;
};

types$1.dollarBraceL.updateContext = function() {
  this.context.push(types.b_tmpl);
  this.exprAllowed = true;
};

types$1.parenL.updateContext = function(prevType) {
  var statementParens =
    prevType === types$1._if || prevType === types$1._for || prevType === types$1._with || prevType === types$1._while;
  this.context.push(statementParens ? types.p_stat : types.p_expr);
  this.exprAllowed = true;
};

types$1.incDec.updateContext = function() {};

types$1._function.updateContext = types$1._class.updateContext = function(prevType) {
  prevType.beforeExpr && prevType !== types$1._else &&
  (prevType !== types$1.semi || this.curContext() === types.p_stat) &&
  (prevType !== types$1._return || !lineBreak.test(this.input.slice(this.lastTokEnd, this.start))) &&
  ((prevType !== types$1.colon && prevType !== types$1.braceL) || this.curContext() !== types.b_stat)
    ? this.context.push(types.f_expr)
    : this.context.push(types.f_stat);
  this.exprAllowed = false;
};

types$1.colon.updateContext = function() {
  this.curContext().token !== "function" || this.context.pop();
  this.exprAllowed = true;
};

types$1.backQuote.updateContext = function() {
  this.curContext() === types.q_tmpl ? this.context.pop() : this.context.push(types.q_tmpl);
  this.exprAllowed = false;
};

types$1.star.updateContext = function(prevType) {
  if (prevType === types$1._function) {
    var index = this.context.length - 1;
    this.context[index] === types.f_expr ? (this.context[index] = types.f_expr_gen) : (this.context[index] = types.f_gen);
  }
  this.exprAllowed = true;
};

types$1.name.updateContext = function(prevType) {
  var allowed = false;
  if (
    this.options.ecmaVersion >= 6 && prevType !== types$1.dot &&
    ((this.value === "of" && !this.exprAllowed) || (this.value === "yield" && this.inGeneratorContext()))
  )
    allowed = true;

  this.exprAllowed = allowed;
};

pp.checkPropClash = function(prop, propHash, refDestructuringErrors) {
  if (
    (this.options.ecmaVersion >= 9 && prop.type === "SpreadElement") ||
    (this.options.ecmaVersion >= 6 && (prop.computed || prop.method || prop.shorthand))
  )
    return;
  var name,
    key = prop.key;
  switch (key.type) {
  case "Identifier": name = key.name; break;
  case "Literal": name = String(key.value); break;
  default: return;
  }
  var kind = prop.kind;
  if (this.options.ecmaVersion >= 6) {
    if (name === "__proto__" && kind === "init") {
      if (propHash.proto)
        refDestructuringErrors
          ? refDestructuringErrors.doubleProto < 0 && (refDestructuringErrors.doubleProto = key.start)
          : this.raiseRecoverable(key.start, "Redefinition of __proto__ property");

      propHash.proto = true;
    }
    return;
  }
  var other = propHash[(name = "$" + name)];
  other
    ? (kind === "init" ? (this.strict && other.init) || other.get || other.set : other.init || other[kind]) &&
      this.raiseRecoverable(key.start, "Redefinition of property")
    : (other = propHash[name] = {init: false, get: false, set: false});

  other[kind] = true;
};

pp.parseExpression = function(forInit, refDestructuringErrors) {
  var startPos = this.start, startLoc = this.startLoc,
    expr = this.parseMaybeAssign(forInit, refDestructuringErrors);
  if (this.type === types$1.comma) {
    var node = this.startNodeAt(startPos, startLoc);
    node.expressions = [expr];
    while (this.eat(types$1.comma)) node.expressions.push(this.parseMaybeAssign(forInit, refDestructuringErrors));
    return this.finishNode(node, "SequenceExpression");
  }
  return expr;
};

pp.parseMaybeAssign = function(forInit, refDestructuringErrors, afterLeftParse) {
  if (this.isContextual("yield")) {
    if (this.inGenerator) return this.parseYield(forInit);
    this.exprAllowed = false;
  }

  var ownDestructuringErrors = false, oldParenAssign = -1, oldTrailingComma = -1, oldDoubleProto = -1;
  if (refDestructuringErrors) {
    oldParenAssign = refDestructuringErrors.parenthesizedAssign;
    oldTrailingComma = refDestructuringErrors.trailingComma;
    oldDoubleProto = refDestructuringErrors.doubleProto;
    refDestructuringErrors.parenthesizedAssign = refDestructuringErrors.trailingComma = -1;
  } else {
    refDestructuringErrors = new DestructuringErrors();
    ownDestructuringErrors = true;
  }

  var startPos = this.start, startLoc = this.startLoc;
  if (this.type === types$1.parenL || this.type === types$1.name) {
    this.potentialArrowAt = this.start;
    this.potentialArrowInForAwait = forInit === "await";
  }
  var left = this.parseMaybeConditional(forInit, refDestructuringErrors);
  if (afterLeftParse) left = afterLeftParse.call(this, left, startPos, startLoc);
  if (this.type.isAssign) {
    var node = this.startNodeAt(startPos, startLoc);
    node.operator = this.value;
    if (this.type === types$1.eq) left = this.toAssignable(left, false, refDestructuringErrors);
    ownDestructuringErrors ||
      (refDestructuringErrors.parenthesizedAssign = refDestructuringErrors.trailingComma = refDestructuringErrors.doubleProto = -1);

    if (refDestructuringErrors.shorthandAssign >= left.start) refDestructuringErrors.shorthandAssign = -1;
    this.type === types$1.eq ? this.checkLValPattern(left) : this.checkLValSimple(left);
    node.left = left;
    this.next();
    node.right = this.parseMaybeAssign(forInit);
    if (oldDoubleProto > -1) refDestructuringErrors.doubleProto = oldDoubleProto;
    return this.finishNode(node, "AssignmentExpression");
  }
  ownDestructuringErrors && this.checkExpressionErrors(refDestructuringErrors, true);

  if (oldParenAssign > -1) refDestructuringErrors.parenthesizedAssign = oldParenAssign;
  if (oldTrailingComma > -1) refDestructuringErrors.trailingComma = oldTrailingComma;
  return left;
};

pp.parseMaybeConditional = function(forInit, refDestructuringErrors) {
  var startPos = this.start, startLoc = this.startLoc,
    expr = this.parseExprOps(forInit, refDestructuringErrors);
  if (this.checkExpressionErrors(refDestructuringErrors)) return expr;
  if (this.eat(types$1.question)) {
    var node = this.startNodeAt(startPos, startLoc);
    node.test = expr;
    node.consequent = this.parseMaybeAssign();
    this.expect(types$1.colon);
    node.alternate = this.parseMaybeAssign(forInit);
    return this.finishNode(node, "ConditionalExpression");
  }
  return expr;
};

pp.parseExprOps = function(forInit, refDestructuringErrors) {
  var startPos = this.start, startLoc = this.startLoc,
    expr = this.parseMaybeUnary(refDestructuringErrors, false, false, forInit);
  return this.checkExpressionErrors(refDestructuringErrors) ||
    (expr.start === startPos && expr.type === "ArrowFunctionExpression")
    ? expr
    : this.parseExprOp(expr, startPos, startLoc, -1, forInit);
};

pp.parseExprOp = function(left, leftStartPos, leftStartLoc, minPrec, forInit) {
  var prec = this.type.binop;
  if (prec != null && (!forInit || this.type !== types$1._in) && prec > minPrec) {
    var logical = this.type === types$1.logicalOR || this.type === types$1.logicalAND,
      coalesce = this.type === types$1.coalesce;
    if (coalesce) prec = types$1.logicalAND.binop;

    var op = this.value;
    this.next();
    var startPos = this.start, startLoc = this.startLoc,
      right = this.parseExprOp(this.parseMaybeUnary(null, false, false, forInit), startPos, startLoc, prec, forInit),
      node = this.buildBinary(leftStartPos, leftStartLoc, left, right, op, logical || coalesce);

    ((logical && this.type === types$1.coalesce) ||
      (coalesce && (this.type === types$1.logicalOR || this.type === types$1.logicalAND))) &&
      this.raiseRecoverable(this.start, "Logical expressions and coalesce expressions cannot be mixed. Wrap either by parentheses");

    return this.parseExprOp(node, leftStartPos, leftStartLoc, minPrec, forInit);
  }
  return left;
};

pp.buildBinary = function(startPos, startLoc, left, right, op, logical) {
  right.type !== "PrivateIdentifier" || this.raise(right.start, "Private identifier can only be left side of binary expression");
  var node = this.startNodeAt(startPos, startLoc);
  node.left = left;
  node.operator = op;
  node.right = right;
  return this.finishNode(node, logical ? "LogicalExpression" : "BinaryExpression");
};

pp.parseMaybeUnary = function(refDestructuringErrors, sawUnary, incDec, forInit) {
  var expr, startPos = this.start, startLoc = this.startLoc;
  if (this.isContextual("await") && this.canAwait) {
    expr = this.parseAwait(forInit);
    sawUnary = true;
  } else if (this.type.prefix) {
    var node = this.startNode(), update = this.type === types$1.incDec;
    node.operator = this.value;
    node.prefix = true;
    this.next();
    node.argument = this.parseMaybeUnary(null, true, update, forInit);
    this.checkExpressionErrors(refDestructuringErrors, true);
    update
      ? this.checkLValSimple(node.argument)
      : this.strict && node.operator === "delete" && node.argument.type === "Identifier"
      ? this.raiseRecoverable(node.start, "Deleting local variable in strict mode")
      : node.operator === "delete" && isPrivateFieldAccess(node.argument)
      ? this.raiseRecoverable(node.start, "Private fields can not be deleted")
      : (sawUnary = true);
    expr = this.finishNode(node, update ? "UpdateExpression" : "UnaryExpression");
  } else if (!sawUnary && this.type === types$1.privateId) {
    (forInit || this.privateNameStack.length === 0) && this.options.checkPrivateFields && this.unexpected();
    expr = this.parsePrivateIdent();
    this.type === types$1._in || this.unexpected();
  } else {
    expr = this.parseExprSubscripts(refDestructuringErrors, forInit);
    if (this.checkExpressionErrors(refDestructuringErrors)) return expr;
    while (this.type.postfix && !this.canInsertSemicolon()) {
      var node$1 = this.startNodeAt(startPos, startLoc);
      node$1.operator = this.value;
      node$1.prefix = false;
      node$1.argument = expr;
      this.checkLValSimple(expr);
      this.next();
      expr = this.finishNode(node$1, "UpdateExpression");
    }
  }

  if (incDec || !this.eat(types$1.starstar)) return expr;
  if (!sawUnary) return this.buildBinary(startPos, startLoc, expr, this.parseMaybeUnary(null, false, false, forInit), "**", false);

  this.unexpected(this.lastTokStart);
};

function isPrivateFieldAccess(node) {
  return (
    (node.type === "MemberExpression" && node.property.type === "PrivateIdentifier") ||
    (node.type === "ChainExpression" && isPrivateFieldAccess(node.expression))
  );
}

pp.parseExprSubscripts = function(refDestructuringErrors, forInit) {
  var startPos = this.start, startLoc = this.startLoc,
    expr = this.parseExprAtom(refDestructuringErrors, forInit);
  if (expr.type === "ArrowFunctionExpression" && this.input.slice(this.lastTokStart, this.lastTokEnd) !== ")") return expr;
  var result = this.parseSubscripts(expr, startPos, startLoc, false, forInit);
  if (refDestructuringErrors && result.type === "MemberExpression") {
    if (refDestructuringErrors.parenthesizedAssign >= result.start) refDestructuringErrors.parenthesizedAssign = -1;
    if (refDestructuringErrors.parenthesizedBind >= result.start) refDestructuringErrors.parenthesizedBind = -1;
    if (refDestructuringErrors.trailingComma >= result.start) refDestructuringErrors.trailingComma = -1;
  }
  return result;
};

pp.parseSubscripts = function(base, startPos, startLoc, noCalls, forInit) {
  var maybeAsyncArrow =
    this.options.ecmaVersion >= 8 && base.type === "Identifier" && base.name === "async" &&
    this.lastTokEnd === base.end && !this.canInsertSemicolon() && base.end - base.start == 5 &&
    this.potentialArrowAt === base.start;

  for (var optionalChained = false; ; ) {
    var element = this.parseSubscript(base, startPos, startLoc, noCalls, maybeAsyncArrow, optionalChained, forInit);

    if (element.optional) optionalChained = true;
    if (element === base || element.type === "ArrowFunctionExpression") {
      if (optionalChained) {
        var chainNode = this.startNodeAt(startPos, startLoc);
        chainNode.expression = element;
        element = this.finishNode(chainNode, "ChainExpression");
      }
      return element;
    }

    base = element;
  }
};

pp.shouldParseAsyncArrow = function() {
  return !this.canInsertSemicolon() && this.eat(types$1.arrow);
};

pp.parseSubscriptAsyncArrow = function(startPos, startLoc, exprList, forInit) {
  return this.parseArrowExpression(this.startNodeAt(startPos, startLoc), exprList, true, forInit);
};

pp.parseSubscript = function(base, startPos, startLoc, noCalls, maybeAsyncArrow, optionalChained, forInit) {
  var optionalSupported = this.options.ecmaVersion >= 11,
    optional = optionalSupported && this.eat(types$1.questionDot);
  noCalls && optional && this.raise(this.lastTokStart, "Optional chaining cannot appear in the callee of new expressions");

  var computed = this.eat(types$1.bracketL);
  if (computed || (optional && this.type !== types$1.parenL && this.type !== types$1.backQuote) || this.eat(types$1.dot)) {
    var node = this.startNodeAt(startPos, startLoc);
    node.object = base;
    if (computed) {
      node.property = this.parseExpression();
      this.expect(types$1.bracketR);
    } else
      this.type === types$1.privateId && base.type !== "Super"
        ? (node.property = this.parsePrivateIdent())
        : (node.property = this.parseIdent(this.options.allowReserved !== "never"));

    node.computed = !!computed;
    if (optionalSupported) node.optional = optional;

    base = this.finishNode(node, "MemberExpression");
  } else if (!noCalls && this.eat(types$1.parenL)) {
    var refDestructuringErrors = new DestructuringErrors(),
      oldYieldPos = this.yieldPos,
      oldAwaitPos = this.awaitPos,
      oldAwaitIdentPos = this.awaitIdentPos;
    this.yieldPos = 0;
    this.awaitPos = 0;
    this.awaitIdentPos = 0;
    var exprList = this.parseExprList(types$1.parenR, this.options.ecmaVersion >= 8, false, refDestructuringErrors);
    if (maybeAsyncArrow && !optional && this.shouldParseAsyncArrow()) {
      this.checkPatternErrors(refDestructuringErrors, false);
      this.checkYieldAwaitInDefaultParams();
      this.awaitIdentPos > 0 && this.raise(this.awaitIdentPos, "Cannot use 'await' as identifier inside an async function");
      this.yieldPos = oldYieldPos;
      this.awaitPos = oldAwaitPos;
      this.awaitIdentPos = oldAwaitIdentPos;
      return this.parseSubscriptAsyncArrow(startPos, startLoc, exprList, forInit);
    }
    this.checkExpressionErrors(refDestructuringErrors, true);
    this.yieldPos = oldYieldPos || this.yieldPos;
    this.awaitPos = oldAwaitPos || this.awaitPos;
    this.awaitIdentPos = oldAwaitIdentPos || this.awaitIdentPos;
    var node$1 = this.startNodeAt(startPos, startLoc);
    node$1.callee = base;
    node$1.arguments = exprList;
    if (optionalSupported) node$1.optional = optional;

    base = this.finishNode(node$1, "CallExpression");
  } else if (this.type === types$1.backQuote) {
    if (optional || optionalChained)
      this.raise(this.start, "Optional chaining cannot appear in the tag of tagged template expressions");

    var node$2 = this.startNodeAt(startPos, startLoc);
    node$2.tag = base;
    node$2.quasi = this.parseTemplate({isTagged: true});
    base = this.finishNode(node$2, "TaggedTemplateExpression");
  }
  return base;
};

pp.parseExprAtom = function(refDestructuringErrors, forInit, forNew) {
  this.type !== types$1.slash || this.readRegexp();

  var node, canBeArrow = this.potentialArrowAt === this.start;
  switch (this.type) {
  case types$1._super:
    this.allowSuper || this.raise(this.start, "'super' keyword outside a method");
    node = this.startNode();
    this.next();
    this.type !== types$1.parenL || this.allowDirectSuper || this.raise(node.start, "super() call outside constructor of a subclass");
    this.type === types$1.dot || this.type === types$1.bracketL || this.type === types$1.parenL || this.unexpected();
    return this.finishNode(node, "Super");

  case types$1._this:
    node = this.startNode();
    this.next();
    return this.finishNode(node, "ThisExpression");

  case types$1.name:
    var startPos = this.start, startLoc = this.startLoc, containsEsc = this.containsEsc,
      id = this.parseIdent(false);
    if (
      this.options.ecmaVersion >= 8 && !containsEsc && id.name === "async" && !this.canInsertSemicolon() && this.eat(types$1._function)
    ) {
      this.overrideContext(types.f_expr);
      return this.parseFunction(this.startNodeAt(startPos, startLoc), 0, false, true, forInit);
    }
    if (canBeArrow && !this.canInsertSemicolon()) {
      if (this.eat(types$1.arrow)) return this.parseArrowExpression(this.startNodeAt(startPos, startLoc), [id], false, forInit);
      if (
        this.options.ecmaVersion >= 8 && id.name === "async" && this.type === types$1.name && !containsEsc &&
        (!this.potentialArrowInForAwait || this.value !== "of" || this.containsEsc)
      ) {
        id = this.parseIdent(false);
        (!this.canInsertSemicolon() && this.eat(types$1.arrow)) || this.unexpected();
        return this.parseArrowExpression(this.startNodeAt(startPos, startLoc), [id], true, forInit);
      }
    }
    return id;

  case types$1.regexp:
    var value = this.value;
    (node = this.parseLiteral(value.value)).regex = {pattern: value.pattern, flags: value.flags};
    return node;

  case types$1.num: case types$1.string:
    return this.parseLiteral(this.value);

  case types$1._null: case types$1._true: case types$1._false:
    (node = this.startNode()).value = this.type === types$1._null ? null : this.type === types$1._true;
    node.raw = this.type.keyword;
    this.next();
    return this.finishNode(node, "Literal");

  case types$1.parenL:
    var start = this.start, expr = this.parseParenAndDistinguishExpression(canBeArrow, forInit);
    if (refDestructuringErrors) {
      if (refDestructuringErrors.parenthesizedAssign < 0 && !this.isSimpleAssignTarget(expr))
        refDestructuringErrors.parenthesizedAssign = start;
      if (refDestructuringErrors.parenthesizedBind < 0) refDestructuringErrors.parenthesizedBind = start;
    }
    return expr;

  case types$1.bracketL:
    node = this.startNode();
    this.next();
    node.elements = this.parseExprList(types$1.bracketR, true, true, refDestructuringErrors);
    return this.finishNode(node, "ArrayExpression");

  case types$1.braceL:
    this.overrideContext(types.b_expr);
    return this.parseObj(false, refDestructuringErrors);

  case types$1._function:
    node = this.startNode();
    this.next();
    return this.parseFunction(node, 0);

  case types$1._class:
    return this.parseClass(this.startNode(), false);

  case types$1._new:
    return this.parseNew();

  case types$1.backQuote:
    return this.parseTemplate();

  case types$1._import:
    return this.options.ecmaVersion >= 11 ? this.parseExprImport(forNew) : this.unexpected();

  default:
    return this.parseExprAtomDefault();
  }
};

pp.parseExprAtomDefault = function() {
  this.unexpected();
};

pp.parseExprImport = function(forNew) {
  var node = this.startNode();

  this.containsEsc && this.raiseRecoverable(this.start, "Escape sequence in keyword import");
  this.next();

  if (this.type === types$1.parenL && !forNew) return this.parseDynamicImport(node);
  if (this.type === types$1.dot) {
    var meta = this.startNodeAt(node.start, node.loc && node.loc.start);
    meta.name = "import";
    node.meta = this.finishNode(meta, "Identifier");
    return this.parseImportMeta(node);
  }

  this.unexpected();
};

pp.parseDynamicImport = function(node) {
  this.next();

  node.source = this.parseMaybeAssign();

  if (!this.eat(types$1.parenR)) {
    var errorPos = this.start;
    this.eat(types$1.comma) && this.eat(types$1.parenR)
      ? this.raiseRecoverable(errorPos, "Trailing comma is not allowed in import()")
      : this.unexpected(errorPos);
  }

  return this.finishNode(node, "ImportExpression");
};

pp.parseImportMeta = function(node) {
  this.next();

  var containsEsc = this.containsEsc;
  node.property = this.parseIdent(true);

  node.property.name === "meta" ||
    this.raiseRecoverable(node.property.start, "The only valid meta property for import is 'import.meta'");
  containsEsc && this.raiseRecoverable(node.start, "'import.meta' must not contain escaped characters");
  this.options.sourceType === "module" || this.options.allowImportExportEverywhere ||
    this.raiseRecoverable(node.start, "Cannot use 'import.meta' outside a module");

  return this.finishNode(node, "MetaProperty");
};

pp.parseLiteral = function(value) {
  var node = this.startNode();
  node.value = value;
  node.raw = this.input.slice(this.start, this.end);
  if (node.raw.charCodeAt(node.raw.length - 1) === 110) node.bigint = node.raw.slice(0, -1).replace(/_/g, "");
  this.next();
  return this.finishNode(node, "Literal");
};

pp.parseParenExpression = function() {
  this.expect(types$1.parenL);
  var val = this.parseExpression();
  this.expect(types$1.parenR);
  return val;
};

pp.shouldParseArrow = function(_exprList) {
  return !this.canInsertSemicolon();
};

pp.parseParenAndDistinguishExpression = function(canBeArrow, forInit) {
  var val, startPos = this.start, startLoc = this.startLoc, allowTrailingComma = this.options.ecmaVersion >= 8;
  if (this.options.ecmaVersion >= 6) {
    this.next();

    var spreadStart, innerStartPos = this.start, innerStartLoc = this.startLoc,
      exprList = [], first = true, lastIsComma = false,
      refDestructuringErrors = new DestructuringErrors(), oldYieldPos = this.yieldPos, oldAwaitPos = this.awaitPos;
    this.yieldPos = 0;
    this.awaitPos = 0;
    while (this.type !== types$1.parenR) {
      first ? (first = false) : this.expect(types$1.comma);
      if (allowTrailingComma && this.afterTrailingComma(types$1.parenR, true)) {
        lastIsComma = true;
        break;
      }
      if (this.type === types$1.ellipsis) {
        spreadStart = this.start;
        exprList.push(this.parseParenItem(this.parseRestBinding()));
        this.type !== types$1.comma || this.raiseRecoverable(this.start, "Comma is not permitted after the rest element");

        break;
      }
      exprList.push(this.parseMaybeAssign(false, refDestructuringErrors, this.parseParenItem));
    }
    var innerEndPos = this.lastTokEnd, innerEndLoc = this.lastTokEndLoc;
    this.expect(types$1.parenR);

    if (canBeArrow && this.shouldParseArrow(exprList) && this.eat(types$1.arrow)) {
      this.checkPatternErrors(refDestructuringErrors, false);
      this.checkYieldAwaitInDefaultParams();
      this.yieldPos = oldYieldPos;
      this.awaitPos = oldAwaitPos;
      return this.parseParenArrowList(startPos, startLoc, exprList, forInit);
    }

    (exprList.length && !lastIsComma) || this.unexpected(this.lastTokStart);
    spreadStart && this.unexpected(spreadStart);
    this.checkExpressionErrors(refDestructuringErrors, true);
    this.yieldPos = oldYieldPos || this.yieldPos;
    this.awaitPos = oldAwaitPos || this.awaitPos;

    if (exprList.length > 1) {
      (val = this.startNodeAt(innerStartPos, innerStartLoc)).expressions = exprList;
      this.finishNodeAt(val, "SequenceExpression", innerEndPos, innerEndLoc);
    } else val = exprList[0];
  } else val = this.parseParenExpression();

  if (this.options.preserveParens) {
    var par = this.startNodeAt(startPos, startLoc);
    par.expression = val;
    return this.finishNode(par, "ParenthesizedExpression");
  }
  return val;
};

pp.parseParenItem = function(item) {
  return item;
};

pp.parseParenArrowList = function(startPos, startLoc, exprList, forInit) {
  return this.parseArrowExpression(this.startNodeAt(startPos, startLoc), exprList, false, forInit);
};

var empty = [];

pp.parseNew = function() {
  this.containsEsc && this.raiseRecoverable(this.start, "Escape sequence in keyword new");
  var node = this.startNode();
  this.next();
  if (this.options.ecmaVersion >= 6 && this.type === types$1.dot) {
    var meta = this.startNodeAt(node.start, node.loc && node.loc.start);
    meta.name = "new";
    node.meta = this.finishNode(meta, "Identifier");
    this.next();
    var containsEsc = this.containsEsc;
    node.property = this.parseIdent(true);
    node.property.name === "target" ||
      this.raiseRecoverable(node.property.start, "The only valid meta property for new is 'new.target'");
    containsEsc && this.raiseRecoverable(node.start, "'new.target' must not contain escaped characters");
    this.allowNewDotTarget || this.raiseRecoverable(node.start, "'new.target' can only be used in functions and class static block");
    return this.finishNode(node, "MetaProperty");
  }
  var startPos = this.start, startLoc = this.startLoc;
  node.callee = this.parseSubscripts(this.parseExprAtom(null, false, true), startPos, startLoc, true, false);
  this.eat(types$1.parenL)
    ? (node.arguments = this.parseExprList(types$1.parenR, this.options.ecmaVersion >= 8, false))
    : (node.arguments = empty);
  return this.finishNode(node, "NewExpression");
};

pp.parseTemplateElement = function(ref) {
  var isTagged = ref.isTagged,

    elem = this.startNode();
  if (this.type === types$1.invalidTemplate) {
    isTagged || this.raiseRecoverable(this.start, "Bad escape sequence in untagged template literal");

    elem.value = {raw: this.value, cooked: null};
  } else elem.value = {raw: this.input.slice(this.start, this.end).replace(/\r\n?/g, "\n"), cooked: this.value};

  this.next();
  elem.tail = this.type === types$1.backQuote;
  return this.finishNode(elem, "TemplateElement");
};

pp.parseTemplate = function(ref) {
  if (ref === void 0) ref = {};
  var isTagged = ref.isTagged;
  if (isTagged === void 0) isTagged = false;

  var node = this.startNode();
  this.next();
  node.expressions = [];
  var curElt = this.parseTemplateElement({isTagged: isTagged});
  node.quasis = [curElt];
  while (!curElt.tail) {
    this.type !== types$1.eof || this.raise(this.pos, "Unterminated template literal");
    this.expect(types$1.dollarBraceL);
    node.expressions.push(this.parseExpression());
    this.expect(types$1.braceR);
    node.quasis.push((curElt = this.parseTemplateElement({isTagged: isTagged})));
  }
  this.next();
  return this.finishNode(node, "TemplateLiteral");
};

pp.isAsyncProp = function(prop) {
  return (
    !prop.computed && prop.key.type === "Identifier" && prop.key.name === "async" &&
    (this.type === types$1.name ||
      this.type === types$1.num ||
      this.type === types$1.string ||
      this.type === types$1.bracketL ||
      this.type.keyword ||
      (this.options.ecmaVersion >= 9 && this.type === types$1.star)) &&
    !lineBreak.test(this.input.slice(this.lastTokEnd, this.start))
  );
};

pp.parseObj = function(isPattern, refDestructuringErrors) {
  var node = this.startNode(), first = true, propHash = {};
  node.properties = [];
  this.next();
  while (!this.eat(types$1.braceR)) {
    if (!first) {
      this.expect(types$1.comma);
      if (this.options.ecmaVersion >= 5 && this.afterTrailingComma(types$1.braceR)) break;
    } else first = false;

    var prop = this.parseProperty(isPattern, refDestructuringErrors);
    isPattern || this.checkPropClash(prop, propHash, refDestructuringErrors);
    node.properties.push(prop);
  }
  return this.finishNode(node, isPattern ? "ObjectPattern" : "ObjectExpression");
};

pp.parseProperty = function(isPattern, refDestructuringErrors) {
  var isGenerator, isAsync, startPos, startLoc, prop = this.startNode();
  if (this.options.ecmaVersion >= 9 && this.eat(types$1.ellipsis)) {
    if (isPattern) {
      prop.argument = this.parseIdent(false);
      this.type !== types$1.comma || this.raiseRecoverable(this.start, "Comma is not permitted after the rest element");

      return this.finishNode(prop, "RestElement");
    }
    prop.argument = this.parseMaybeAssign(false, refDestructuringErrors);
    if (this.type === types$1.comma && refDestructuringErrors && refDestructuringErrors.trailingComma < 0)
      refDestructuringErrors.trailingComma = this.start;

    return this.finishNode(prop, "SpreadElement");
  }
  if (this.options.ecmaVersion >= 6) {
    prop.method = false;
    prop.shorthand = false;
    if (isPattern || refDestructuringErrors) {
      startPos = this.start;
      startLoc = this.startLoc;
    }
    isPattern || (isGenerator = this.eat(types$1.star));
  }
  var containsEsc = this.containsEsc;
  this.parsePropertyName(prop);
  if (!isPattern && !containsEsc && this.options.ecmaVersion >= 8 && !isGenerator && this.isAsyncProp(prop)) {
    isAsync = true;
    isGenerator = this.options.ecmaVersion >= 9 && this.eat(types$1.star);
    this.parsePropertyName(prop);
  } else isAsync = false;

  this.parsePropertyValue(prop, isPattern, isGenerator, isAsync, startPos, startLoc, refDestructuringErrors, containsEsc);
  return this.finishNode(prop, "Property");
};

pp.parseGetterSetter = function(prop) {
  prop.kind = prop.key.name;
  this.parsePropertyName(prop);
  prop.value = this.parseMethod(false);
  var paramCount = prop.kind === "get" ? 0 : 1;
  if (prop.value.params.length !== paramCount) {
    var start = prop.value.start;
    prop.kind === "get"
      ? this.raiseRecoverable(start, "getter should have no params")
      : this.raiseRecoverable(start, "setter should have exactly one param");
  } else
    prop.kind !== "set" || prop.value.params[0].type !== "RestElement" ||
      this.raiseRecoverable(prop.value.params[0].start, "Setter cannot use rest params");
};

pp.parsePropertyValue = function(prop, isPattern, isGenerator, isAsync, startPos, startLoc, refDestructuringErrors, containsEsc) {
  (isGenerator || isAsync) && this.type === types$1.colon && this.unexpected();

  if (this.eat(types$1.colon)) {
    prop.value = isPattern ? this.parseMaybeDefault(this.start, this.startLoc) : this.parseMaybeAssign(false, refDestructuringErrors);
    prop.kind = "init";
  } else if (this.options.ecmaVersion >= 6 && this.type === types$1.parenL) {
    isPattern && this.unexpected();
    prop.kind = "init";
    prop.method = true;
    prop.value = this.parseMethod(isGenerator, isAsync);
  } else if (
    !isPattern && !containsEsc &&
    this.options.ecmaVersion >= 5 && !prop.computed && prop.key.type === "Identifier" &&
    (prop.key.name === "get" || prop.key.name === "set") &&
    this.type !== types$1.comma && this.type !== types$1.braceR && this.type !== types$1.eq
  ) {
    if (isGenerator || isAsync) this.unexpected();
    this.parseGetterSetter(prop);
  } else if (this.options.ecmaVersion >= 6 && !prop.computed && prop.key.type === "Identifier") {
    if (isGenerator || isAsync) this.unexpected();
    this.checkUnreserved(prop.key);
    prop.key.name !== "await" || this.awaitIdentPos || (this.awaitIdentPos = startPos);
    prop.kind = "init";
    if (isPattern) prop.value = this.parseMaybeDefault(startPos, startLoc, this.copyNode(prop.key));
    else if (this.type === types$1.eq && refDestructuringErrors) {
      if (refDestructuringErrors.shorthandAssign < 0) refDestructuringErrors.shorthandAssign = this.start;
      prop.value = this.parseMaybeDefault(startPos, startLoc, this.copyNode(prop.key));
    } else prop.value = this.copyNode(prop.key);

    prop.shorthand = true;
  } else this.unexpected();
};

pp.parsePropertyName = function(prop) {
  if (this.options.ecmaVersion >= 6) {
    if (this.eat(types$1.bracketL)) {
      prop.computed = true;
      prop.key = this.parseMaybeAssign();
      this.expect(types$1.bracketR);
      return prop.key;
    }
    prop.computed = false;
  }
  return (prop.key = this.type === types$1.num || this.type === types$1.string
    ? this.parseExprAtom() : this.parseIdent(this.options.allowReserved !== "never"));
};

pp.initFunction = function(node) {
  node.id = null;
  if (this.options.ecmaVersion >= 6) node.generator = node.expression = false;
  if (this.options.ecmaVersion >= 8) node.async = false;
};

pp.parseMethod = function(isGenerator, isAsync, allowDirectSuper) {
  var node = this.startNode(), oldYieldPos = this.yieldPos, oldAwaitPos = this.awaitPos, oldAwaitIdentPos = this.awaitIdentPos;

  this.initFunction(node);
  if (this.options.ecmaVersion >= 6) node.generator = isGenerator;
  if (this.options.ecmaVersion >= 8) node.async = !!isAsync;

  this.yieldPos = 0;
  this.awaitPos = 0;
  this.awaitIdentPos = 0;
  this.enterScope(functionFlags(isAsync, node.generator) | SCOPE_SUPER | (allowDirectSuper ? SCOPE_DIRECT_SUPER : 0));

  this.expect(types$1.parenL);
  node.params = this.parseBindingList(types$1.parenR, false, this.options.ecmaVersion >= 8);
  this.checkYieldAwaitInDefaultParams();
  this.parseFunctionBody(node, false, true, false);

  this.yieldPos = oldYieldPos;
  this.awaitPos = oldAwaitPos;
  this.awaitIdentPos = oldAwaitIdentPos;
  return this.finishNode(node, "FunctionExpression");
};

pp.parseArrowExpression = function(node, params, isAsync, forInit) {
  var oldYieldPos = this.yieldPos, oldAwaitPos = this.awaitPos, oldAwaitIdentPos = this.awaitIdentPos;

  this.enterScope(functionFlags(isAsync, false) | SCOPE_ARROW);
  this.initFunction(node);
  if (this.options.ecmaVersion >= 8) node.async = !!isAsync;

  this.yieldPos = 0;
  this.awaitPos = 0;
  this.awaitIdentPos = 0;

  node.params = this.toAssignableList(params, true);
  this.parseFunctionBody(node, true, false, forInit);

  this.yieldPos = oldYieldPos;
  this.awaitPos = oldAwaitPos;
  this.awaitIdentPos = oldAwaitIdentPos;
  return this.finishNode(node, "ArrowFunctionExpression");
};

pp.parseFunctionBody = function(node, isArrowFunction, isMethod, forInit) {
  var isExpression = isArrowFunction && this.type !== types$1.braceL,
    oldStrict = this.strict, useStrict = false;

  if (isExpression) {
    node.body = this.parseMaybeAssign(forInit);
    node.expression = true;
    this.checkParams(node, false);
  } else {
    var nonSimple = this.options.ecmaVersion >= 7 && !this.isSimpleParamList(node.params);
    (!oldStrict || nonSimple) &&
      (useStrict = this.strictDirective(this.end)) && nonSimple &&
      this.raiseRecoverable(node.start, "Illegal 'use strict' directive in function with non-simple parameter list");

    var oldLabels = this.labels;
    this.labels = [];
    if (useStrict) this.strict = true;

    this.checkParams(node, !oldStrict && !useStrict && !isArrowFunction && !isMethod && this.isSimpleParamList(node.params));
    this.strict && node.id && this.checkLValSimple(node.id, BIND_OUTSIDE);
    node.body = this.parseBlock(false, void 0, useStrict && !oldStrict);
    node.expression = false;
    this.adaptDirectivePrologue(node.body.body);
    this.labels = oldLabels;
  }
  this.exitScope();
};

pp.isSimpleParamList = function(params) {
  for (var i = 0, list = params; i < list.length; i++) if (list[i].type !== "Identifier") return false;

  return true;
};

pp.checkParams = function(node, allowDuplicates) {
  for (var nameHash = Object.create(null), i = 0, list = node.params; i < list.length; i++) {
    var param = list[i];

    this.checkLValInnerPattern(param, BIND_VAR, allowDuplicates ? null : nameHash);
  }
};

pp.parseExprList = function(close, allowTrailingComma, allowEmpty, refDestructuringErrors) {
  var elts = [], first = true;
  while (!this.eat(close)) {
    if (!first) {
      this.expect(types$1.comma);
      if (allowTrailingComma && this.afterTrailingComma(close)) break;
    } else first = false;

    var elt = void 0;
    if (allowEmpty && this.type === types$1.comma) elt = null;
    else if (this.type === types$1.ellipsis) {
      elt = this.parseSpread(refDestructuringErrors);
      if (refDestructuringErrors && this.type === types$1.comma && refDestructuringErrors.trailingComma < 0)
        refDestructuringErrors.trailingComma = this.start;
    } else elt = this.parseMaybeAssign(false, refDestructuringErrors);

    elts.push(elt);
  }
  return elts;
};

pp.checkUnreserved = function(ref) {
  var start = ref.start,
    end = ref.end,
    name = ref.name;

  this.inGenerator && name === "yield" && this.raiseRecoverable(start, "Cannot use 'yield' as identifier inside a generator");
  this.inAsync && name === "await" && this.raiseRecoverable(start, "Cannot use 'await' as identifier inside an async function");
  this.currentThisScope().inClassFieldInit && name === "arguments" &&
    this.raiseRecoverable(start, "Cannot use 'arguments' in class field initializer");
  this.inClassStaticBlock && (name === "arguments" || name === "await") &&
    this.raise(start, "Cannot use " + name + " in class static initialization block");
  this.keywords.test(name) && this.raise(start, "Unexpected keyword '" + name + "'");
  if (
    (this.options.ecmaVersion >= 6 || this.input.slice(start, end).indexOf("\\") < 0) &&
    (this.strict ? this.reservedWordsStrict : this.reservedWords).test(name)
  ) {
    this.inAsync || name !== "await" || this.raiseRecoverable(start, "Cannot use keyword 'await' outside an async function");
    this.raiseRecoverable(start, "The keyword '" + name + "' is reserved");
  }
};

pp.parseIdent = function(liberal) {
  var node = this.parseIdentNode();
  this.next(!!liberal);
  this.finishNode(node, "Identifier");
  if (!liberal) {
    this.checkUnreserved(node);
    node.name !== "await" || this.awaitIdentPos || (this.awaitIdentPos = node.start);
  }
  return node;
};

pp.parseIdentNode = function() {
  var node = this.startNode();
  if (this.type === types$1.name) node.name = this.value;
  else if (this.type.keyword) {
    node.name = this.type.keyword;

    (node.name !== "class" && node.name !== "function") ||
      (this.lastTokEnd === this.lastTokStart + 1 && this.input.charCodeAt(this.lastTokStart) === 46) ||
      this.context.pop();

    this.type = types$1.name;
  } else this.unexpected();

  return node;
};

pp.parsePrivateIdent = function() {
  var node = this.startNode();
  this.type === types$1.privateId ? (node.name = this.value) : this.unexpected();

  this.next();
  this.finishNode(node, "PrivateIdentifier");

  if (this.options.checkPrivateFields)
    this.privateNameStack.length === 0
      ? this.raise(node.start, "Private field '#" + node.name + "' must be declared in an enclosing class")
      : this.privateNameStack[this.privateNameStack.length - 1].used.push(node);

  return node;
};

pp.parseYield = function(forInit) {
  this.yieldPos || (this.yieldPos = this.start);

  var node = this.startNode();
  this.next();
  if (this.type === types$1.semi || this.canInsertSemicolon() || (this.type !== types$1.star && !this.type.startsExpr)) {
    node.delegate = false;
    node.argument = null;
  } else {
    node.delegate = this.eat(types$1.star);
    node.argument = this.parseMaybeAssign(forInit);
  }
  return this.finishNode(node, "YieldExpression");
};

pp.parseAwait = function(forInit) {
  this.awaitPos || (this.awaitPos = this.start);

  var node = this.startNode();
  this.next();
  node.argument = this.parseMaybeUnary(null, true, false, forInit);
  return this.finishNode(node, "AwaitExpression");
};

pp.raise = function(pos, message) {
  var loc = getLineInfo(this.input, pos);
  message += " (" + loc.line + ":" + loc.column + ")";
  var err = new SyntaxError(message);
  err.pos = pos;
  err.loc = loc;
  err.raisedAt = this.pos;
  throw err;
};

pp.raiseRecoverable = pp.raise;

pp.curPosition = function() {
  if (this.options.locations) return new Position(this.curLine, this.pos - this.lineStart);
};

function Scope(flags) {
  this.flags = flags;
  this.var = [];
  this.lexical = [];
  this.functions = [];
  this.inClassFieldInit = false;
}

pp.enterScope = function(flags) {
  this.scopeStack.push(new Scope(flags));
};

pp.exitScope = function() {
  this.scopeStack.pop();
};

pp.treatFunctionsAsVarInScope = function(scope) {
  return scope.flags & SCOPE_FUNCTION || (!this.inModule && scope.flags & SCOPE_TOP);
};

pp.declareName = function(name, bindingType, pos) {
  var redeclared = false;
  if (bindingType === BIND_LEXICAL) {
    var scope = this.currentScope();
    redeclared = scope.lexical.indexOf(name) > -1 || scope.functions.indexOf(name) > -1 || scope.var.indexOf(name) > -1;
    scope.lexical.push(name);
    this.inModule && scope.flags & SCOPE_TOP && delete this.undefinedExports[name];
  } else if (bindingType === BIND_SIMPLE_CATCH) this.currentScope().lexical.push(name);
  else if (bindingType === BIND_FUNCTION) {
    var scope$2 = this.currentScope();
    redeclared = this.treatFunctionsAsVar
      ? scope$2.lexical.indexOf(name) > -1
      : scope$2.lexical.indexOf(name) > -1 || scope$2.var.indexOf(name) > -1;
    scope$2.functions.push(name);
  } else
    for (var i = this.scopeStack.length - 1; i >= 0; --i) {
      var scope$3 = this.scopeStack[i];
      if (
        (scope$3.lexical.indexOf(name) > -1 && !(scope$3.flags & SCOPE_SIMPLE_CATCH && scope$3.lexical[0] === name)) ||
        (!this.treatFunctionsAsVarInScope(scope$3) && scope$3.functions.indexOf(name) > -1)
      ) {
        redeclared = true;
        break;
      }
      scope$3.var.push(name);
      this.inModule && scope$3.flags & SCOPE_TOP && delete this.undefinedExports[name];
      if (scope$3.flags & SCOPE_VAR) break;
    }

  redeclared && this.raiseRecoverable(pos, "Identifier '" + name + "' has already been declared");
};

pp.checkLocalExport = function(id) {
  if (this.scopeStack[0].lexical.indexOf(id.name) < 0 && this.scopeStack[0].var.indexOf(id.name) < 0)
    this.undefinedExports[id.name] = id;
};

pp.currentScope = function() {
  return this.scopeStack[this.scopeStack.length - 1];
};

pp.currentVarScope = function() {
  for (var i = this.scopeStack.length - 1; ; i--) {
    var scope = this.scopeStack[i];
    if (scope.flags & SCOPE_VAR) return scope;
  }
};

pp.currentThisScope = function() {
  for (var i = this.scopeStack.length - 1; ; i--) {
    var scope = this.scopeStack[i];
    if (scope.flags & SCOPE_VAR && !(scope.flags & SCOPE_ARROW)) return scope;
  }
};

/**
 * @constructor
 * @property {Array} arguments
 */
function Node(parser, pos, loc) {
  this.type = "";
  this.start = pos;
  this.end = 0;
  if (parser.options.locations) this.loc = new SourceLocation(parser, loc);
  if (parser.options.directSourceFile) this.sourceFile = parser.options.directSourceFile;
  if (parser.options.ranges) this.range = [pos, 0];
}

pp.startNode = function() {
  return new Node(this, this.start, this.startLoc);
};

pp.startNodeAt = function(pos, loc) {
  return new Node(this, pos, loc);
};

function finishNodeAt(node, type, pos, loc) {
  node.type = type;
  node.end = pos;
  if (this.options.locations) node.loc.end = loc;
  if (this.options.ranges) node.range[1] = pos;
  return node;
}

pp.finishNode = function(node, type) {
  return finishNodeAt.call(this, node, type, this.lastTokEnd, this.lastTokEndLoc);
};

pp.finishNodeAt = function(node, type, pos, loc) {
  return finishNodeAt.call(this, node, type, pos, loc);
};

pp.copyNode = function(node) {
  var newNode = new Node(this, node.start, this.startLoc);
  for (var prop in node) newNode[prop] = node[prop];
  return newNode;
};

// noinspection SpellCheckingInspection
var ecma9BinaryProperties =
    "ASCII ASCII_Hex_Digit AHex Alphabetic Alpha Any Assigned Bidi_Control Bidi_C Bidi_Mirrored Bidi_M Case_Ignorable CI Cased Changes_When_Casefolded CWCF Changes_When_Casemapped CWCM Changes_When_Lowercased CWL Changes_When_NFKC_Casefolded CWKCF Changes_When_Titlecased CWT Changes_When_Uppercased CWU Dash Default_Ignorable_Code_Point DI Deprecated Dep Diacritic Dia Emoji Emoji_Component Emoji_Modifier Emoji_Modifier_Base Emoji_Presentation Extender Ext Grapheme_Base Gr_Base Grapheme_Extend Gr_Ext Hex_Digit Hex IDS_Binary_Operator IDSB IDS_Trinary_Operator IDST ID_Continue IDC ID_Start IDS Ideographic Ideo Join_Control Join_C Logical_Order_Exception LOE Lowercase Lower Math Noncharacter_Code_Point NChar Pattern_Syntax Pat_Syn Pattern_White_Space Pat_WS Quotation_Mark QMark Radical Regional_Indicator RI Sentence_Terminal STerm Soft_Dotted SD Terminal_Punctuation Term Unified_Ideograph UIdeo Uppercase Upper Variation_Selector VS White_Space space XID_Continue XIDC XID_Start XIDS",
  ecma10BinaryProperties = ecma9BinaryProperties + " Extended_Pictographic",
  ecma11BinaryProperties = ecma10BinaryProperties,
  ecma12BinaryProperties = ecma11BinaryProperties + " EBase EComp EMod EPres ExtPict",
  ecma13BinaryProperties = ecma12BinaryProperties,
  ecma14BinaryProperties = ecma13BinaryProperties;

var unicodeBinaryProperties = {
  9: ecma9BinaryProperties,
  10: ecma10BinaryProperties,
  11: ecma11BinaryProperties,
  12: ecma12BinaryProperties,
  13: ecma13BinaryProperties,
  14: ecma14BinaryProperties
};

var ecma14BinaryPropertiesOfStrings =
  "Basic_Emoji Emoji_Keycap_Sequence RGI_Emoji_Modifier_Sequence RGI_Emoji_Flag_Sequence RGI_Emoji_Tag_Sequence RGI_Emoji_ZWJ_Sequence RGI_Emoji";

var unicodeBinaryPropertiesOfStrings = {
  9: "",
  10: "",
  11: "",
  12: "",
  13: "",
  14: ecma14BinaryPropertiesOfStrings
};

var unicodeGeneralCategoryValues =
  "Cased_Letter LC Close_Punctuation Pe Connector_Punctuation Pc Control Cc cntrl Currency_Symbol Sc Dash_Punctuation Pd Decimal_Number Nd digit Enclosing_Mark Me Final_Punctuation Pf Format Cf Initial_Punctuation Pi Letter L Letter_Number Nl Line_Separator Zl Lowercase_Letter Ll Mark M Combining_Mark Math_Symbol Sm Modifier_Letter Lm Modifier_Symbol Sk Nonspacing_Mark Mn Number N Open_Punctuation Ps Other C Other_Letter Lo Other_Number No Other_Punctuation Po Other_Symbol So Paragraph_Separator Zp Private_Use Co Punctuation P punct Separator Z Space_Separator Zs Spacing_Mark Mc Surrogate Cs Symbol S Titlecase_Letter Lt Unassigned Cn Uppercase_Letter Lu";

// noinspection SpellCheckingInspection
var ecma9ScriptValues =
    "Adlam Adlm Ahom Anatolian_Hieroglyphs Hluw Arabic Arab Armenian Armn Avestan Avst Balinese Bali Bamum Bamu Bassa_Vah Bass Batak Batk Bengali Beng Bhaiksuki Bhks Bopomofo Bopo Brahmi Brah Braille Brai Buginese Bugi Buhid Buhd Canadian_Aboriginal Cans Carian Cari Caucasian_Albanian Aghb Chakma Cakm Cham Cham Cherokee Cher Common Zyyy Coptic Copt Qaac Cuneiform Xsux Cypriot Cprt Cyrillic Cyrl Deseret Dsrt Devanagari Deva Duployan Dupl Egyptian_Hieroglyphs Egyp Elbasan Elba Ethiopic Ethi Georgian Geor Glagolitic Glag Gothic Goth Grantha Gran Greek Grek Gujarati Gujr Gurmukhi Guru Han Hani Hangul Hang Hanunoo Hano Hatran Hatr Hebrew Hebr Hiragana Hira Imperial_Aramaic Armi Inherited Zinh Qaai Inscriptional_Pahlavi Phli Inscriptional_Parthian Prti Javanese Java Kaithi Kthi Kannada Knda Katakana Kana Kayah_Li Kali Kharoshthi Khar Khmer Khmr Khojki Khoj Khudawadi Sind Lao Laoo Latin Latn Lepcha Lepc Limbu Limb Linear_A Lina Linear_B Linb Lisu Lisu Lycian Lyci Lydian Lydi Mahajani Mahj Malayalam Mlym Mandaic Mand Manichaean Mani Marchen Marc Masaram_Gondi Gonm Meetei_Mayek Mtei Mende_Kikakui Mend Meroitic_Cursive Merc Meroitic_Hieroglyphs Mero Miao Plrd Modi Mongolian Mong Mro Mroo Multani Mult Myanmar Mymr Nabataean Nbat New_Tai_Lue Talu Newa Newa Nko Nkoo Nushu Nshu Ogham Ogam Ol_Chiki Olck Old_Hungarian Hung Old_Italic Ital Old_North_Arabian Narb Old_Permic Perm Old_Persian Xpeo Old_South_Arabian Sarb Old_Turkic Orkh Oriya Orya Osage Osge Osmanya Osma Pahawh_Hmong Hmng Palmyrene Palm Pau_Cin_Hau Pauc Phags_Pa Phag Phoenician Phnx Psalter_Pahlavi Phlp Rejang Rjng Runic Runr Samaritan Samr Saurashtra Saur Sharada Shrd Shavian Shaw Siddham Sidd SignWriting Sgnw Sinhala Sinh Sora_Sompeng Sora Soyombo Soyo Sundanese Sund Syloti_Nagri Sylo Syriac Syrc Tagalog Tglg Tagbanwa Tagb Tai_Le Tale Tai_Tham Lana Tai_Viet Tavt Takri Takr Tamil Taml Tangut Tang Telugu Telu Thaana Thaa Thai Thai Tibetan Tibt Tifinagh Tfng Tirhuta Tirh Ugaritic Ugar Vai Vaii Warang_Citi Wara Yi Yiii Zanabazar_Square Zanb",
  ecma10ScriptValues =
    ecma9ScriptValues + " Dogra Dogr Gunjala_Gondi Gong Hanifi_Rohingya Rohg Makasar Maka Medefaidrin Medf Old_Sogdian Sogo Sogdian Sogd",
  ecma11ScriptValues = ecma10ScriptValues + " Elymaic Elym Nandinagari Nand Nyiakeng_Puachue_Hmong Hmnp Wancho Wcho",
  ecma12ScriptValues = ecma11ScriptValues + " Chorasmian Chrs Diak Dives_Akuru Khitan_Small_Script Kits Yezi Yezidi",
  ecma13ScriptValues = ecma12ScriptValues + " Cypro_Minoan Cpmn Old_Uyghur Ougr Tangsa Tnsa Toto Vithkuqi Vith",
  ecma14ScriptValues = ecma13ScriptValues + " Hrkt Katakana_Or_Hiragana Kawi Nag_Mundari Nagm Unknown Zzzz";

var unicodeScriptValues = {
  9: ecma9ScriptValues,
  10: ecma10ScriptValues,
  11: ecma11ScriptValues,
  12: ecma12ScriptValues,
  13: ecma13ScriptValues,
  14: ecma14ScriptValues
};

var data = {};
function buildUnicodeData(ecmaVersion) {
  var d = (data[ecmaVersion] = {
    binary: wordsRegexp(unicodeBinaryProperties[ecmaVersion] + " " + unicodeGeneralCategoryValues),
    binaryOfStrings: wordsRegexp(unicodeBinaryPropertiesOfStrings[ecmaVersion]),
    nonBinary: {
      General_Category: wordsRegexp(unicodeGeneralCategoryValues),
      Script: wordsRegexp(unicodeScriptValues[ecmaVersion])
    }
  });
  d.nonBinary.Script_Extensions = d.nonBinary.Script;

  d.nonBinary.gc = d.nonBinary.General_Category;
  d.nonBinary.sc = d.nonBinary.Script;
  d.nonBinary.scx = d.nonBinary.Script_Extensions;
}

[9, 10, 11, 12, 13, 14].forEach(buildUnicodeData);

function RegExpValidationState(parser) {
  this.parser = parser;
  this.validFlags =
    "gim" +
    (parser.options.ecmaVersion >= 6 ? "uy" : "") +
    (parser.options.ecmaVersion >= 9 ? "s" : "") +
    (parser.options.ecmaVersion >= 13 ? "d" : "") +
    (parser.options.ecmaVersion >= 15 ? "v" : "");
  this.unicodeProperties = data[parser.options.ecmaVersion >= 14 ? 14 : parser.options.ecmaVersion];
  this.source = "";
  this.flags = "";
  this.start = 0;
  this.switchU = false;
  this.switchV = false;
  this.switchN = false;
  this.pos = 0;
  this.lastIntValue = 0;
  this.lastStringValue = "";
  this.lastAssertionIsQuantifiable = false;
  this.numCapturingParens = 0;
  this.maxBackReference = 0;
  this.groupNames = [];
  this.backReferenceNames = [];
}

RegExpValidationState.prototype.reset = function(start, pattern, flags) {
  var unicodeSets = flags.indexOf("v") > -1,
    unicode = flags.indexOf("u") > -1;
  this.start = start | 0;
  this.source = pattern + "";
  this.flags = flags;
  if (unicodeSets && this.parser.options.ecmaVersion >= 15) {
    this.switchU = true;
    this.switchV = true;
    this.switchN = true;
  } else {
    this.switchU = unicode && this.parser.options.ecmaVersion >= 6;
    this.switchV = false;
    this.switchN = unicode && this.parser.options.ecmaVersion >= 9;
  }
};

RegExpValidationState.prototype.raise = function(message) {
  this.parser.raiseRecoverable(this.start, "Invalid regular expression: /" + this.source + "/: " + message);
};

RegExpValidationState.prototype.at = function(i, forceU) {
  if (forceU === void 0) forceU = false;

  var s = this.source,
    l = s.length;
  if (i >= l) return -1;

  var c = s.charCodeAt(i);
  if (!(forceU || this.switchU) || c <= 0xD7FF || c >= 0xE000 || i + 1 >= l) return c;

  var next = s.charCodeAt(i + 1);
  return next >= 0xDC00 && next <= 0xDFFF ? (c << 10) + next - 0x35FDC00 : c;
};

RegExpValidationState.prototype.nextIndex = function(i, forceU) {
  if (forceU === void 0) forceU = false;

  var s = this.source,
    l = s.length;
  if (i >= l) return l;

  var next, c = s.charCodeAt(i);
  return !(forceU || this.switchU) || c <= 0xD7FF || c >= 0xE000 || i + 1 >= l ||
    (next = s.charCodeAt(i + 1)) < 0xDC00 || next > 0xDFFF
    ? i + 1
    : i + 2;
};

RegExpValidationState.prototype.current = function(forceU) {
  if (forceU === void 0) forceU = false;

  return this.at(this.pos, forceU);
};

RegExpValidationState.prototype.lookahead = function(forceU) {
  if (forceU === void 0) forceU = false;

  return this.at(this.nextIndex(this.pos, forceU), forceU);
};

RegExpValidationState.prototype.advance = function(forceU) {
  if (forceU === void 0) forceU = false;

  this.pos = this.nextIndex(this.pos, forceU);
};

RegExpValidationState.prototype.eat = function(ch, forceU) {
  if (forceU === void 0) forceU = false;

  if (this.current(forceU) === ch) {
    this.advance(forceU);
    return true;
  }
  return false;
};

RegExpValidationState.prototype.eatChars = function(chs, forceU) {
  if (forceU === void 0) forceU = false;

  var pos = this.pos;
  for (var i = 0, list = chs; i < list.length; i++) {
    var ch = list[i],

      current = this.at(pos, forceU);
    if (current === -1 || current !== ch) return false;

    pos = this.nextIndex(pos, forceU);
  }
  this.pos = pos;
  return true;
};

pp.validateRegExpFlags = function(state) {
  var validFlags = state.validFlags,
    flags = state.flags,

    u = false,
    v = false;

  for (var i = 0; i < flags.length; i++) {
    var flag = flags.charAt(i);
    validFlags.indexOf(flag) < 0 && this.raise(state.start, "Invalid regular expression flag");

    flags.indexOf(flag, i + 1) < 0 || this.raise(state.start, "Duplicate regular expression flag");

    if (flag === "u") u = true;
    if (flag === "v") v = true;
  }
  this.options.ecmaVersion >= 15 && u && v && this.raise(state.start, "Invalid regular expression flag");
};

pp.validateRegExpPattern = function(state) {
  this.regexp_pattern(state);

  if (!state.switchN && this.options.ecmaVersion >= 9 && state.groupNames.length > 0) {
    state.switchN = true;
    this.regexp_pattern(state);
  }
};

pp.regexp_pattern = function(state) {
  state.pos = 0;
  state.lastIntValue = 0;
  state.lastStringValue = "";
  state.lastAssertionIsQuantifiable = false;
  state.numCapturingParens = 0;
  state.maxBackReference = 0;
  state.groupNames.length = 0;
  state.backReferenceNames.length = 0;

  this.regexp_disjunction(state);

  if (state.pos !== state.source.length) {
    state.eat(0x29) && state.raise("Unmatched ')'");

    if (state.eat(0x5D) || state.eat(0x7D)) state.raise("Lone quantifier brackets");
  }
  state.maxBackReference > state.numCapturingParens && state.raise("Invalid escape");

  for (var i = 0, list = state.backReferenceNames; i < list.length; i++) {
    var name = list[i];

    state.groupNames.indexOf(name) < 0 && state.raise("Invalid named capture referenced");
  }
};

pp.regexp_disjunction = function(state) {
  this.regexp_alternative(state);
  while (state.eat(0x7C)) this.regexp_alternative(state);

  this.regexp_eatQuantifier(state, true) && state.raise("Nothing to repeat");

  state.eat(0x7B) && state.raise("Lone quantifier brackets");
};

pp.regexp_alternative = function(state) {
  while (state.pos < state.source.length && this.regexp_eatTerm(state));
};

pp.regexp_eatTerm = function(state) {
  if (this.regexp_eatAssertion(state)) {
    state.lastAssertionIsQuantifiable && this.regexp_eatQuantifier(state) && state.switchU && state.raise("Invalid quantifier");

    return true;
  }

  if (state.switchU ? this.regexp_eatAtom(state) : this.regexp_eatExtendedAtom(state)) {
    this.regexp_eatQuantifier(state);
    return true;
  }

  return false;
};

pp.regexp_eatAssertion = function(state) {
  var start = state.pos;
  state.lastAssertionIsQuantifiable = false;

  if (state.eat(0x5E) || state.eat(0x24)) return true;

  if (state.eat(0x5C)) {
    if (state.eat(0x42) || state.eat(0x62)) return true;

    state.pos = start;
  }

  if (state.eat(0x28) && state.eat(0x3F)) {
    var lookbehind = false;
    if (this.options.ecmaVersion >= 9) lookbehind = state.eat(0x3C);

    if (state.eat(0x3D) || state.eat(0x21)) {
      this.regexp_disjunction(state);
      state.eat(0x29) || state.raise("Unterminated group");

      state.lastAssertionIsQuantifiable = !lookbehind;
      return true;
    }
  }

  state.pos = start;
  return false;
};

pp.regexp_eatQuantifier = function(state, noError) {
  if (noError === void 0) noError = false;

  if (this.regexp_eatQuantifierPrefix(state, noError)) {
    state.eat(0x3F);
    return true;
  }
  return false;
};

pp.regexp_eatQuantifierPrefix = function(state, noError) {
  return state.eat(0x2A) || state.eat(0x2B) || state.eat(0x3F) || this.regexp_eatBracedQuantifier(state, noError);
};
pp.regexp_eatBracedQuantifier = function(state, noError) {
  var start = state.pos;
  if (state.eat(0x7B)) {
    var min = 0, max = -1;
    if (this.regexp_eatDecimalDigits(state)) {
      min = state.lastIntValue;
      if (state.eat(0x2C) && this.regexp_eatDecimalDigits(state)) max = state.lastIntValue;

      if (state.eat(0x7D)) {
        max !== -1 && max < min && !noError && state.raise("numbers out of order in {} quantifier");

        return true;
      }
    }
    !state.switchU || noError || state.raise("Incomplete quantifier");

    state.pos = start;
  }
  return false;
};

pp.regexp_eatAtom = function(state) {
  return (
    this.regexp_eatPatternCharacters(state) ||
    state.eat(0x2E) ||
    this.regexp_eatReverseSolidusAtomEscape(state) ||
    this.regexp_eatCharacterClass(state) ||
    this.regexp_eatUncapturingGroup(state) ||
    this.regexp_eatCapturingGroup(state)
  );
};
pp.regexp_eatReverseSolidusAtomEscape = function(state) {
  var start = state.pos;
  if (state.eat(0x5C)) {
    if (this.regexp_eatAtomEscape(state)) return true;

    state.pos = start;
  }
  return false;
};
pp.regexp_eatUncapturingGroup = function(state) {
  var start = state.pos;
  if (state.eat(0x28)) {
    if (state.eat(0x3F) && state.eat(0x3A)) {
      this.regexp_disjunction(state);
      if (state.eat(0x29)) return true;

      state.raise("Unterminated group");
    }
    state.pos = start;
  }
  return false;
};
pp.regexp_eatCapturingGroup = function(state) {
  if (state.eat(0x28)) {
    this.options.ecmaVersion >= 9 ? this.regexp_groupSpecifier(state) : state.current() !== 0x3F || state.raise("Invalid group");

    this.regexp_disjunction(state);
    if (state.eat(0x29)) {
      state.numCapturingParens += 1;
      return true;
    }
    state.raise("Unterminated group");
  }
  return false;
};

pp.regexp_eatExtendedAtom = function(state) {
  return (
    state.eat(0x2E) ||
    this.regexp_eatReverseSolidusAtomEscape(state) ||
    this.regexp_eatCharacterClass(state) ||
    this.regexp_eatUncapturingGroup(state) ||
    this.regexp_eatCapturingGroup(state) ||
    this.regexp_eatInvalidBracedQuantifier(state) ||
    this.regexp_eatExtendedPatternCharacter(state)
  );
};

pp.regexp_eatInvalidBracedQuantifier = function(state) {
  this.regexp_eatBracedQuantifier(state, true) && state.raise("Nothing to repeat");

  return false;
};

pp.regexp_eatSyntaxCharacter = function(state) {
  var ch = state.current();
  if (isSyntaxCharacter(ch)) {
    state.lastIntValue = ch;
    state.advance();
    return true;
  }
  return false;
};
function isSyntaxCharacter(ch) {
  return (
    ch === 0x24 || (ch >= 0x28 && ch <= 0x2B) || ch === 0x2E || ch === 0x3F || (ch >= 0x5B && ch <= 0x5E) || (ch >= 0x7B && ch <= 0x7D)
  );
}

pp.regexp_eatPatternCharacters = function(state) {
  var start = state.pos;
  for (var ch = 0; (ch = state.current()) !== -1 && !isSyntaxCharacter(ch); ) state.advance();

  return state.pos !== start;
};

pp.regexp_eatExtendedPatternCharacter = function(state) {
  var ch = state.current();
  if (
    ch !== -1 &&
    ch !== 0x24 &&
    (ch < 0x28 || ch > 0x2B) &&
    ch !== 0x2E &&
    ch !== 0x3F &&
    ch !== 0x5B &&
    ch !== 0x5E &&
    ch !== 0x7C
  ) {
    state.advance();
    return true;
  }
  return false;
};

pp.regexp_groupSpecifier = function(state) {
  if (state.eat(0x3F)) {
    if (this.regexp_eatGroupName(state)) {
      state.groupNames.indexOf(state.lastStringValue) < 0 || state.raise("Duplicate capture group name");

      state.groupNames.push(state.lastStringValue);
      return;
    }
    state.raise("Invalid group");
  }
};

pp.regexp_eatGroupName = function(state) {
  state.lastStringValue = "";
  if (state.eat(0x3C)) {
    if (this.regexp_eatRegExpIdentifierName(state) && state.eat(0x3E)) return true;

    state.raise("Invalid capture group name");
  }
  return false;
};

pp.regexp_eatRegExpIdentifierName = function(state) {
  state.lastStringValue = "";
  if (this.regexp_eatRegExpIdentifierStart(state)) {
    state.lastStringValue += codePointToString(state.lastIntValue);
    while (this.regexp_eatRegExpIdentifierPart(state)) state.lastStringValue += codePointToString(state.lastIntValue);

    return true;
  }
  return false;
};

pp.regexp_eatRegExpIdentifierStart = function(state) {
  var start = state.pos,
    forceU = this.options.ecmaVersion >= 11,
    ch = state.current(forceU);
  state.advance(forceU);

  if (ch === 0x5C && this.regexp_eatRegExpUnicodeEscapeSequence(state, forceU)) ch = state.lastIntValue;

  if (isRegExpIdentifierStart(ch)) {
    state.lastIntValue = ch;
    return true;
  }

  state.pos = start;
  return false;
};
function isRegExpIdentifierStart(ch) {
  return isIdentifierStart(ch, true) || ch === 0x24 || ch === 0x5F;
}

pp.regexp_eatRegExpIdentifierPart = function(state) {
  var start = state.pos,
    forceU = this.options.ecmaVersion >= 11,
    ch = state.current(forceU);
  state.advance(forceU);

  if (ch === 0x5C && this.regexp_eatRegExpUnicodeEscapeSequence(state, forceU)) ch = state.lastIntValue;

  if (isRegExpIdentifierPart(ch)) {
    state.lastIntValue = ch;
    return true;
  }

  state.pos = start;
  return false;
};
function isRegExpIdentifierPart(ch) {
  return isIdentifierChar(ch, true) || ch === 0x24 || ch === 0x5F || ch === 0x200C || ch === 0x200D;
}

pp.regexp_eatAtomEscape = function(state) {
  if (
    this.regexp_eatBackReference(state) ||
    this.regexp_eatCharacterClassEscape(state) ||
    this.regexp_eatCharacterEscape(state) ||
    (state.switchN && this.regexp_eatKGroupName(state))
  )
    return true;

  if (state.switchU) {
    state.current() !== 0x63 || state.raise("Invalid unicode escape");

    state.raise("Invalid escape");
  }
  return false;
};
pp.regexp_eatBackReference = function(state) {
  var start = state.pos;
  if (this.regexp_eatDecimalEscape(state)) {
    var n = state.lastIntValue;
    if (state.switchU) {
      if (n > state.maxBackReference) state.maxBackReference = n;

      return true;
    }
    if (n <= state.numCapturingParens) return true;

    state.pos = start;
  }
  return false;
};
pp.regexp_eatKGroupName = function(state) {
  if (state.eat(0x6B)) {
    if (this.regexp_eatGroupName(state)) {
      state.backReferenceNames.push(state.lastStringValue);
      return true;
    }
    state.raise("Invalid named reference");
  }
  return false;
};

pp.regexp_eatCharacterEscape = function(state) {
  return (
    this.regexp_eatControlEscape(state) ||
    this.regexp_eatCControlLetter(state) ||
    this.regexp_eatZero(state) ||
    this.regexp_eatHexEscapeSequence(state) ||
    this.regexp_eatRegExpUnicodeEscapeSequence(state, false) ||
    (!state.switchU && this.regexp_eatLegacyOctalEscapeSequence(state)) ||
    this.regexp_eatIdentityEscape(state)
  );
};
pp.regexp_eatCControlLetter = function(state) {
  var start = state.pos;
  if (state.eat(0x63)) {
    if (this.regexp_eatControlLetter(state)) return true;

    state.pos = start;
  }
  return false;
};
pp.regexp_eatZero = function(state) {
  if (state.current() !== 0x30 || isDecimalDigit(state.lookahead())) return false;

  state.lastIntValue = 0;
  state.advance();
  return true;
};

pp.regexp_eatControlEscape = function(state) {
  var ch = state.current();
  if (ch === 0x74) {
    state.lastIntValue = 0x09;
    state.advance();
    return true;
  }
  if (ch === 0x6E) {
    state.lastIntValue = 0x0A;
    state.advance();
    return true;
  }
  if (ch === 0x76) {
    state.lastIntValue = 0x0B;
    state.advance();
    return true;
  }
  if (ch === 0x66) {
    state.lastIntValue = 0x0C;
    state.advance();
    return true;
  }
  if (ch === 0x72) {
    state.lastIntValue = 0x0D;
    state.advance();
    return true;
  }
  return false;
};

pp.regexp_eatControlLetter = function(state) {
  var ch = state.current();
  if (isControlLetter(ch)) {
    state.lastIntValue = ch % 0x20;
    state.advance();
    return true;
  }
  return false;
};
function isControlLetter(ch) {
  return (ch >= 0x41 && ch <= 0x5A) || (ch >= 0x61 && ch <= 0x7A);
}

pp.regexp_eatRegExpUnicodeEscapeSequence = function(state, forceU) {
  if (forceU === void 0) forceU = false;

  var start = state.pos,
    switchU = forceU || state.switchU;

  if (state.eat(0x75)) {
    if (this.regexp_eatFixedHexDigits(state, 4)) {
      var lead = state.lastIntValue;
      if (switchU && lead >= 0xD800 && lead <= 0xDBFF) {
        var leadSurrogateEnd = state.pos;
        if (state.eat(0x5C) && state.eat(0x75) && this.regexp_eatFixedHexDigits(state, 4)) {
          var trail = state.lastIntValue;
          if (trail >= 0xDC00 && trail <= 0xDFFF) {
            state.lastIntValue = 0x400 * (lead - 0xD800) + (trail - 0xDC00) + 0x10000;
            return true;
          }
        }
        state.pos = leadSurrogateEnd;
        state.lastIntValue = lead;
      }
      return true;
    }
    if (switchU && state.eat(0x7B) && this.regexp_eatHexDigits(state) && state.eat(0x7D) && isValidUnicode(state.lastIntValue))
      return true;

    switchU && state.raise("Invalid unicode escape");

    state.pos = start;
  }

  return false;
};
function isValidUnicode(ch) {
  return ch >= 0 && ch <= 0x10FFFF;
}

pp.regexp_eatIdentityEscape = function(state) {
  if (state.switchU) {
    if (this.regexp_eatSyntaxCharacter(state)) return true;

    if (state.eat(0x2F)) {
      state.lastIntValue = 0x2F;
      return true;
    }
    return false;
  }

  var ch = state.current();
  if (ch !== 0x63 && (!state.switchN || ch !== 0x6B)) {
    state.lastIntValue = ch;
    state.advance();
    return true;
  }

  return false;
};

pp.regexp_eatDecimalEscape = function(state) {
  state.lastIntValue = 0;
  var ch = state.current();
  if (ch >= 0x31 && ch <= 0x39) {
    do {
      state.lastIntValue = 10 * state.lastIntValue + (ch - 0x30);
      state.advance();
    } while ((ch = state.current()) >= 0x30 && ch <= 0x39);
    return true;
  }
  return false;
};

var CharSetNone = 0,
  CharSetOk = 1,
  CharSetString = 2;

pp.regexp_eatCharacterClassEscape = function(state) {
  var ch = state.current();

  if (isCharacterClassEscape(ch)) {
    state.lastIntValue = -1;
    state.advance();
    return CharSetOk;
  }

  var negate = false;
  if (state.switchU && this.options.ecmaVersion >= 9 && ((negate = ch === 0x50) || ch === 0x70)) {
    state.lastIntValue = -1;
    state.advance();
    var result;
    if (state.eat(0x7B) && (result = this.regexp_eatUnicodePropertyValueExpression(state)) && state.eat(0x7D)) {
      negate && result === CharSetString && state.raise("Invalid property name");
      return result;
    }
    state.raise("Invalid property name");
  }

  return CharSetNone;
};

function isCharacterClassEscape(ch) {
  return ch === 0x64 || ch === 0x44 || ch === 0x73 || ch === 0x53 || ch === 0x77 || ch === 0x57;
}

pp.regexp_eatUnicodePropertyValueExpression = function(state) {
  var start = state.pos;

  if (this.regexp_eatUnicodePropertyName(state) && state.eat(0x3D)) {
    var name = state.lastStringValue;
    if (this.regexp_eatUnicodePropertyValue(state)) {
      var value = state.lastStringValue;
      this.regexp_validateUnicodePropertyNameAndValue(state, name, value);
      return CharSetOk;
    }
  }
  state.pos = start;

  if (this.regexp_eatLoneUnicodePropertyNameOrValue(state)) {
    var nameOrValue = state.lastStringValue;
    return this.regexp_validateUnicodePropertyNameOrValue(state, nameOrValue);
  }
  return CharSetNone;
};

pp.regexp_validateUnicodePropertyNameAndValue = function(state, name, value) {
  hasOwn(state.unicodeProperties.nonBinary, name) || state.raise("Invalid property name");
  state.unicodeProperties.nonBinary[name].test(value) || state.raise("Invalid property value");
};

pp.regexp_validateUnicodePropertyNameOrValue = function(state, nameOrValue) {
  if (state.unicodeProperties.binary.test(nameOrValue)) return CharSetOk;
  if (state.switchV && state.unicodeProperties.binaryOfStrings.test(nameOrValue)) return CharSetString;
  state.raise("Invalid property name");
};

pp.regexp_eatUnicodePropertyName = function(state) {
  var ch = 0;
  state.lastStringValue = "";
  while (isUnicodePropertyNameCharacter((ch = state.current()))) {
    state.lastStringValue += codePointToString(ch);
    state.advance();
  }
  return state.lastStringValue !== "";
};

function isUnicodePropertyNameCharacter(ch) {
  return isControlLetter(ch) || ch === 0x5F;
}

pp.regexp_eatUnicodePropertyValue = function(state) {
  var ch = 0;
  state.lastStringValue = "";
  while (isUnicodePropertyValueCharacter((ch = state.current()))) {
    state.lastStringValue += codePointToString(ch);
    state.advance();
  }
  return state.lastStringValue !== "";
};
function isUnicodePropertyValueCharacter(ch) {
  return isUnicodePropertyNameCharacter(ch) || isDecimalDigit(ch);
}

pp.regexp_eatLoneUnicodePropertyNameOrValue = function(state) {
  return this.regexp_eatUnicodePropertyValue(state);
};

pp.regexp_eatCharacterClass = function(state) {
  if (state.eat(0x5B)) {
    var negate = state.eat(0x5E),
      result = this.regexp_classContents(state);
    state.eat(0x5D) || state.raise("Unterminated character class");
    negate && result === CharSetString && state.raise("Negated character class may contain strings");
    return true;
  }
  return false;
};

pp.regexp_classContents = function(state) {
  if (state.current() === 0x5D) return CharSetOk;
  if (state.switchV) return this.regexp_classSetExpression(state);
  this.regexp_nonEmptyClassRanges(state);
  return CharSetOk;
};

pp.regexp_nonEmptyClassRanges = function(state) {
  while (this.regexp_eatClassAtom(state)) {
    var left = state.lastIntValue;
    if (state.eat(0x2D) && this.regexp_eatClassAtom(state)) {
      var right = state.lastIntValue;
      state.switchU && (left === -1 || right === -1) && state.raise("Invalid character class");

      left !== -1 && right !== -1 && left > right && state.raise("Range out of order in character class");
    }
  }
};

pp.regexp_eatClassAtom = function(state) {
  var start = state.pos;

  if (state.eat(0x5C)) {
    if (this.regexp_eatClassEscape(state)) return true;

    if (state.switchU) {
      var ch$1 = state.current();
      if (ch$1 === 0x63 || isOctalDigit(ch$1)) state.raise("Invalid class escape");

      state.raise("Invalid escape");
    }
    state.pos = start;
  }

  var ch = state.current();
  if (ch !== 0x5D) {
    state.lastIntValue = ch;
    state.advance();
    return true;
  }

  return false;
};

pp.regexp_eatClassEscape = function(state) {
  var start = state.pos;

  if (state.eat(0x62)) {
    state.lastIntValue = 0x08;
    return true;
  }

  if (state.switchU && state.eat(0x2D)) {
    state.lastIntValue = 0x2D;
    return true;
  }

  if (!state.switchU && state.eat(0x63)) {
    if (this.regexp_eatClassControlLetter(state)) return true;

    state.pos = start;
  }

  return this.regexp_eatCharacterClassEscape(state) || this.regexp_eatCharacterEscape(state);
};

pp.regexp_classSetExpression = function(state) {
  var subResult, result = CharSetOk;
  if (this.regexp_eatClassSetRange(state));
  else if ((subResult = this.regexp_eatClassSetOperand(state))) {
    if (subResult === CharSetString) result = CharSetString;
    var start = state.pos;
    while (state.eatChars([0x26, 0x26]))
      state.current() !== 0x26 && (subResult = this.regexp_eatClassSetOperand(state))
        ? subResult === CharSetString || (result = CharSetOk)
        : state.raise("Invalid character in character class");

    if (start !== state.pos) return result;
    while (state.eatChars([0x2D, 0x2D]))
      this.regexp_eatClassSetOperand(state) || state.raise("Invalid character in character class");

    if (start !== state.pos) return result;
  } else state.raise("Invalid character in character class");

  for (;;)
    if (!this.regexp_eatClassSetRange(state)) {
      if (!(subResult = this.regexp_eatClassSetOperand(state))) return result;
      if (subResult === CharSetString) result = CharSetString;
    }
};

pp.regexp_eatClassSetRange = function(state) {
  var start = state.pos;
  if (this.regexp_eatClassSetCharacter(state)) {
    var left = state.lastIntValue;
    if (state.eat(0x2D) && this.regexp_eatClassSetCharacter(state)) {
      var right = state.lastIntValue;
      left !== -1 && right !== -1 && left > right && state.raise("Range out of order in character class");

      return true;
    }
    state.pos = start;
  }
  return false;
};

pp.regexp_eatClassSetOperand = function(state) {
  return this.regexp_eatClassSetCharacter(state)
    ? CharSetOk
    : this.regexp_eatClassStringDisjunction(state) || this.regexp_eatNestedClass(state);
};

pp.regexp_eatNestedClass = function(state) {
  var start = state.pos;
  if (state.eat(0x5B)) {
    var negate = state.eat(0x5E),
      result = this.regexp_classContents(state);
    if (state.eat(0x5D)) {
      negate && result === CharSetString && state.raise("Negated character class may contain strings");

      return result;
    }
    state.pos = start;
  }
  if (state.eat(0x5C)) {
    var result$1 = this.regexp_eatCharacterClassEscape(state);
    if (result$1) return result$1;

    state.pos = start;
  }
  return null;
};

pp.regexp_eatClassStringDisjunction = function(state) {
  var start = state.pos;
  if (state.eatChars([0x5C, 0x71])) {
    if (state.eat(0x7B)) {
      var result = this.regexp_classStringDisjunctionContents(state);
      if (state.eat(0x7D)) return result;
    } else state.raise("Invalid escape");

    state.pos = start;
  }
  return null;
};

pp.regexp_classStringDisjunctionContents = function(state) {
  var result = this.regexp_classString(state);
  while (state.eat(0x7C)) if (this.regexp_classString(state) === CharSetString) result = CharSetString;

  return result;
};

pp.regexp_classString = function(state) {
  var count = 0;
  while (this.regexp_eatClassSetCharacter(state)) count++;
  return count === 1 ? CharSetOk : CharSetString;
};

pp.regexp_eatClassSetCharacter = function(state) {
  var start = state.pos;
  if (state.eat(0x5C)) {
    if (this.regexp_eatCharacterEscape(state) || this.regexp_eatClassSetReservedPunctuator(state)) return true;

    if (state.eat(0x62)) {
      state.lastIntValue = 0x08;
      return true;
    }
    state.pos = start;
    return false;
  }
  var ch = state.current();
  if (ch < 0 || (ch === state.lookahead() && isClassSetReservedDoublePunctuatorCharacter(ch)) || isClassSetSyntaxCharacter(ch))
    return false;
  state.advance();
  state.lastIntValue = ch;
  return true;
};

function isClassSetReservedDoublePunctuatorCharacter(ch) {
  return (
    ch === 0x21 ||
    (ch >= 0x23 && ch <= 0x26) ||
    (ch >= 0x2A && ch <= 0x2C) ||
    ch === 0x2E ||
    (ch >= 0x3A && ch <= 0x40) ||
    ch === 0x5E ||
    ch === 0x60 ||
    ch === 0x7E
  );
}

function isClassSetSyntaxCharacter(ch) {
  return ch === 0x28 || ch === 0x29 || ch === 0x2D || ch === 0x2F || (ch >= 0x5B && ch <= 0x5D) || (ch >= 0x7B && ch <= 0x7D);
}

pp.regexp_eatClassSetReservedPunctuator = function(state) {
  var ch = state.current();
  if (isClassSetReservedPunctuator(ch)) {
    state.lastIntValue = ch;
    state.advance();
    return true;
  }
  return false;
};

function isClassSetReservedPunctuator(ch) {
  return (
    ch === 0x21 ||
    ch === 0x23 ||
    ch === 0x25 ||
    ch === 0x26 ||
    ch === 0x2C ||
    ch === 0x2D ||
    (ch >= 0x3A && ch <= 0x3E) ||
    ch === 0x40 ||
    ch === 0x60 ||
    ch === 0x7E
  );
}

pp.regexp_eatClassControlLetter = function(state) {
  var ch = state.current();
  if (isDecimalDigit(ch) || ch === 0x5F) {
    state.lastIntValue = ch % 0x20;
    state.advance();
    return true;
  }
  return false;
};

pp.regexp_eatHexEscapeSequence = function(state) {
  var start = state.pos;
  if (state.eat(0x78)) {
    if (this.regexp_eatFixedHexDigits(state, 2)) return true;

    state.switchU && state.raise("Invalid escape");

    state.pos = start;
  }
  return false;
};

pp.regexp_eatDecimalDigits = function(state) {
  var start = state.pos,
    ch = 0;
  state.lastIntValue = 0;
  while (isDecimalDigit((ch = state.current()))) {
    state.lastIntValue = 10 * state.lastIntValue + (ch - 0x30);
    state.advance();
  }
  return state.pos !== start;
};
function isDecimalDigit(ch) {
  return ch >= 0x30 && ch <= 0x39;
}

pp.regexp_eatHexDigits = function(state) {
  var start = state.pos,
    ch = 0;
  state.lastIntValue = 0;
  while (isHexDigit((ch = state.current()))) {
    state.lastIntValue = 16 * state.lastIntValue + hexToInt(ch);
    state.advance();
  }
  return state.pos !== start;
};
function isHexDigit(ch) {
  return (ch >= 0x30 && ch <= 0x39) || (ch >= 0x41 && ch <= 0x46) || (ch >= 0x61 && ch <= 0x66);
}
function hexToInt(ch) {
  return ch >= 0x41 && ch <= 0x46 ? ch - 0x41 + 10 : ch >= 0x61 && ch <= 0x66 ? ch - 0x61 + 10 : ch - 0x30;
}

pp.regexp_eatLegacyOctalEscapeSequence = function(state) {
  if (this.regexp_eatOctalDigit(state)) {
    var n1 = state.lastIntValue;
    if (this.regexp_eatOctalDigit(state)) {
      var n2 = state.lastIntValue;
      n1 <= 3 && this.regexp_eatOctalDigit(state)
        ? (state.lastIntValue = n1 * 64 + n2 * 8 + state.lastIntValue)
        : (state.lastIntValue = n1 * 8 + n2);
    } else state.lastIntValue = n1;

    return true;
  }
  return false;
};

pp.regexp_eatOctalDigit = function(state) {
  var ch = state.current();
  if (isOctalDigit(ch)) {
    state.lastIntValue = ch - 0x30;
    state.advance();
    return true;
  }
  state.lastIntValue = 0;
  return false;
};
function isOctalDigit(ch) {
  return ch >= 0x30 && ch <= 0x37;
}

pp.regexp_eatFixedHexDigits = function(state, length) {
  var start = state.pos;
  state.lastIntValue = 0;
  for (var i = 0; i < length; ++i) {
    var ch = state.current();
    if (!isHexDigit(ch)) {
      state.pos = start;
      return false;
    }
    state.lastIntValue = 16 * state.lastIntValue + hexToInt(ch);
    state.advance();
  }
  return true;
};

function Token(p) {
  this.type = p.type;
  this.value = p.value;
  this.start = p.start;
  this.end = p.end;
  if (p.options.locations) this.loc = new SourceLocation(p, p.startLoc, p.endLoc);
  if (p.options.ranges) this.range = [p.start, p.end];
}

pp.next = function(ignoreEscapeSequenceInKeyword) {
  !ignoreEscapeSequenceInKeyword && this.type.keyword && this.containsEsc &&
    this.raiseRecoverable(this.start, "Escape sequence in keyword " + this.type.keyword);
  this.options.onToken && this.options.onToken(new Token(this));

  this.lastTokEnd = this.end;
  this.lastTokStart = this.start;
  this.lastTokEndLoc = this.endLoc;
  this.lastTokStartLoc = this.startLoc;
  this.nextToken();
};

pp.getToken = function() {
  this.next();
  return new Token(this);
};

if (typeof Symbol != "undefined")
  pp[Symbol.iterator] = function() {
    var this$1$1 = this;

    return {
      next: function() {
        var token = this$1$1.getToken();
        return {done: token.type === types$1.eof, value: token};
      }
    };
  };

pp.nextToken = function() {
  var curContext = this.curContext();
  (curContext && curContext.preserveSpace) || this.skipSpace();

  this.start = this.pos;
  if (this.options.locations) this.startLoc = this.curPosition();
  if (this.pos >= this.input.length) return this.finishToken(types$1.eof);

  if (curContext.override) return curContext.override(this);
  this.readToken(this.fullCharCodeAtPos());
};

pp.readToken = function(code) {
  return isIdentifierStart(code, this.options.ecmaVersion >= 6) || code === 92 ? this.readWord() : this.getTokenFromCode(code);
};

pp.fullCharCodeAtPos = function() {
  var code = this.input.charCodeAt(this.pos);
  if (code <= 0xd7ff || code >= 0xdc00) return code;
  var next = this.input.charCodeAt(this.pos + 1);
  return next <= 0xdbff || next >= 0xe000 ? code : (code << 10) + next - 0x35fdc00;
};

pp.skipBlockComment = function() {
  var startLoc = this.options.onComment && this.curPosition(),
    start = this.pos, end = this.input.indexOf("*/", (this.pos += 2));
  end === -1 && this.raise(this.pos - 2, "Unterminated comment");
  this.pos = end + 2;
  if (this.options.locations)
    for (var nextBreak = void 0, pos = start; (nextBreak = nextLineBreak(this.input, pos, this.pos)) > -1; ) {
      ++this.curLine;
      pos = this.lineStart = nextBreak;
    }

  this.options.onComment &&
    this.options.onComment(true, this.input.slice(start + 2, end), start, this.pos, startLoc, this.curPosition());
};

pp.skipLineComment = function(startSkip) {
  var start = this.pos,
    startLoc = this.options.onComment && this.curPosition(),
    ch = this.input.charCodeAt((this.pos += startSkip));
  while (this.pos < this.input.length && !isNewLine(ch)) ch = this.input.charCodeAt(++this.pos);

  this.options.onComment &&
    this.options.onComment(false, this.input.slice(start + startSkip, this.pos), start, this.pos, startLoc, this.curPosition());
};

pp.skipSpace = function() {
  loop: while (this.pos < this.input.length) {
    var ch = this.input.charCodeAt(this.pos);
    switch (ch) {
    case 32: case 160:
      ++this.pos;
      break;
    case 13:
      this.input.charCodeAt(this.pos + 1) !== 10 || ++this.pos;

    case 10: case 8232: case 8233:
      ++this.pos;
      if (this.options.locations) {
        ++this.curLine;
        this.lineStart = this.pos;
      }
      break;
    case 47:
      switch (this.input.charCodeAt(this.pos + 1)) {
      case 42:
        this.skipBlockComment();
        break;
      case 47:
        this.skipLineComment(2);
        break;
      default:
        break loop;
      }
      break;
    default:
      if ((ch > 8 && ch < 14) || (ch >= 5760 && nonASCIIwhitespace.test(String.fromCharCode(ch)))) ++this.pos;
      else break loop;
    }
  }
};

pp.finishToken = function(type, val) {
  this.end = this.pos;
  if (this.options.locations) this.endLoc = this.curPosition();
  var prevType = this.type;
  this.type = type;
  this.value = val;

  this.updateContext(prevType);
};

pp.readToken_dot = function() {
  var next = this.input.charCodeAt(this.pos + 1);
  if (next >= 48 && next <= 57) return this.readNumber(true);
  var next2 = this.input.charCodeAt(this.pos + 2);
  if (this.options.ecmaVersion >= 6 && next === 46 && next2 === 46) {
    this.pos += 3;
    return this.finishToken(types$1.ellipsis);
  }

  ++this.pos;
  return this.finishToken(types$1.dot);
};

pp.readToken_slash = function() {
  var next = this.input.charCodeAt(this.pos + 1);
  if (this.exprAllowed) {
    ++this.pos;
    return this.readRegexp();
  }
  return next === 61 ? this.finishOp(types$1.assign, 2) : this.finishOp(types$1.slash, 1);
};

pp.readToken_mult_modulo_exp = function(code) {
  var next = this.input.charCodeAt(this.pos + 1),
    size = 1,
    tokentype = code === 42 ? types$1.star : types$1.modulo;

  if (this.options.ecmaVersion >= 7 && code === 42 && next === 42) {
    ++size;
    tokentype = types$1.starstar;
    next = this.input.charCodeAt(this.pos + 2);
  }

  return next === 61 ? this.finishOp(types$1.assign, size + 1) : this.finishOp(tokentype, size);
};

pp.readToken_pipe_amp = function(code) {
  var next = this.input.charCodeAt(this.pos + 1);
  return next === code
    ? this.options.ecmaVersion >= 12 && this.input.charCodeAt(this.pos + 2) === 61
      ? this.finishOp(types$1.assign, 3)
      : this.finishOp(code === 124 ? types$1.logicalOR : types$1.logicalAND, 2)
    : next === 61
    ? this.finishOp(types$1.assign, 2)
    : this.finishOp(code === 124 ? types$1.bitwiseOR : types$1.bitwiseAND, 1);
};

pp.readToken_caret = function() {
  return this.input.charCodeAt(this.pos + 1) === 61 ? this.finishOp(types$1.assign, 2) : this.finishOp(types$1.bitwiseXOR, 1);
};

pp.readToken_plus_min = function(code) {
  var next = this.input.charCodeAt(this.pos + 1);
  if (next === code) {
    if (
      next === 45 && !this.inModule && this.input.charCodeAt(this.pos + 2) === 62 &&
      (this.lastTokEnd === 0 || lineBreak.test(this.input.slice(this.lastTokEnd, this.pos)))
    ) {
      this.skipLineComment(3);
      this.skipSpace();
      return this.nextToken();
    }
    return this.finishOp(types$1.incDec, 2);
  }
  return next === 61 ? this.finishOp(types$1.assign, 2) : this.finishOp(types$1.plusMin, 1);
};

pp.readToken_lt_gt = function(code) {
  var next = this.input.charCodeAt(this.pos + 1),
    size = 1;
  if (next === code) {
    size = code === 62 && this.input.charCodeAt(this.pos + 2) === 62 ? 3 : 2;
    return this.input.charCodeAt(this.pos + size) === 61
      ? this.finishOp(types$1.assign, size + 1)
      : this.finishOp(types$1.bitShift, size);
  }
  if (
    next === 33 && code === 60 && !this.inModule && this.input.charCodeAt(this.pos + 2) === 45 &&
    this.input.charCodeAt(this.pos + 3) === 45
  ) {
    this.skipLineComment(4);
    this.skipSpace();
    return this.nextToken();
  }
  if (next === 61) size = 2;
  return this.finishOp(types$1.relational, size);
};

pp.readToken_eq_excl = function(code) {
  var next = this.input.charCodeAt(this.pos + 1);
  if (next === 61) return this.finishOp(types$1.equality, this.input.charCodeAt(this.pos + 2) === 61 ? 3 : 2);
  if (code === 61 && next === 62 && this.options.ecmaVersion >= 6) {
    this.pos += 2;
    return this.finishToken(types$1.arrow);
  }
  return this.finishOp(code === 61 ? types$1.eq : types$1.prefix, 1);
};

pp.readToken_question = function() {
  var ecmaVersion = this.options.ecmaVersion;
  if (ecmaVersion >= 11) {
    var next = this.input.charCodeAt(this.pos + 1);
    if (next === 46) {
      var next2 = this.input.charCodeAt(this.pos + 2);
      if (next2 < 48 || next2 > 57) return this.finishOp(types$1.questionDot, 2);
    }
    if (next === 63)
      return ecmaVersion >= 12 && this.input.charCodeAt(this.pos + 2) === 61
        ? this.finishOp(types$1.assign, 3)
        : this.finishOp(types$1.coalesce, 2);
  }
  return this.finishOp(types$1.question, 1);
};

pp.readToken_numberSign = function() {
  var code = 35;
  if (this.options.ecmaVersion >= 13) {
    ++this.pos;
    if (isIdentifierStart((code = this.fullCharCodeAtPos()), true) || code === 92)
      return this.finishToken(types$1.privateId, this.readWord1());
  }

  this.raise(this.pos, "Unexpected character '" + codePointToString(code) + "'");
};

pp.getTokenFromCode = function(code) {
  switch (code) {
  case 46:
    return this.readToken_dot();

  case 40: ++this.pos; return this.finishToken(types$1.parenL);
  case 41: ++this.pos; return this.finishToken(types$1.parenR);
  case 59: ++this.pos; return this.finishToken(types$1.semi);
  case 44: ++this.pos; return this.finishToken(types$1.comma);
  case 91: ++this.pos; return this.finishToken(types$1.bracketL);
  case 93: ++this.pos; return this.finishToken(types$1.bracketR);
  case 123: ++this.pos; return this.finishToken(types$1.braceL);
  case 125: ++this.pos; return this.finishToken(types$1.braceR);
  case 58: ++this.pos; return this.finishToken(types$1.colon);

  case 96:
    if (this.options.ecmaVersion < 6) break;
    ++this.pos;
    return this.finishToken(types$1.backQuote);

  case 48:
    var next = this.input.charCodeAt(this.pos + 1);
    if (next === 120 || next === 88) return this.readRadixNumber(16);
    if (this.options.ecmaVersion >= 6) {
      if (next === 111 || next === 79) return this.readRadixNumber(8);
      if (next === 98 || next === 66) return this.readRadixNumber(2);
    }

  case 49: case 50: case 51: case 52: case 53: case 54: case 55: case 56: case 57:
    return this.readNumber(false);

  case 34: case 39:
    return this.readString(code);

  case 47:
    return this.readToken_slash();

  case 37: case 42:
    return this.readToken_mult_modulo_exp(code);

  case 124: case 38:
    return this.readToken_pipe_amp(code);

  case 94:
    return this.readToken_caret();

  case 43: case 45:
    return this.readToken_plus_min(code);

  case 60: case 62:
    return this.readToken_lt_gt(code);

  case 61: case 33:
    return this.readToken_eq_excl(code);

  case 63:
    return this.readToken_question();

  case 126:
    return this.finishOp(types$1.prefix, 1);

  case 35:
    return this.readToken_numberSign();
  }

  this.raise(this.pos, "Unexpected character '" + codePointToString(code) + "'");
};

pp.finishOp = function(type, size) {
  var str = this.input.slice(this.pos, this.pos + size);
  this.pos += size;
  return this.finishToken(type, str);
};

pp.readRegexp = function() {
  var escaped, inClass, start = this.pos;
  for (;;) {
    this.pos < this.input.length || this.raise(start, "Unterminated regular expression");
    var ch = this.input.charAt(this.pos);
    lineBreak.test(ch) && this.raise(start, "Unterminated regular expression");
    if (!escaped) {
      if (ch === "[") inClass = true;
      else if (ch === "]" && inClass) inClass = false;
      else if (ch === "/" && !inClass) break;
      escaped = ch === "\\";
    } else escaped = false;
    ++this.pos;
  }
  var pattern = this.input.slice(start, this.pos);
  ++this.pos;
  var flagsStart = this.pos,
    flags = this.readWord1();
  this.containsEsc && this.unexpected(flagsStart);

  var state = this.regexpState || (this.regexpState = new RegExpValidationState(this));
  state.reset(start, pattern, flags);
  this.validateRegExpFlags(state);
  this.validateRegExpPattern(state);

  var value = null;
  try {
    value = new RegExp(pattern, flags);
  } catch (_) {}

  return this.finishToken(types$1.regexp, {pattern: pattern, flags: flags, value: value});
};

pp.readInt = function(radix, len, maybeLegacyOctalNumericLiteral) {
  var allowSeparators = this.options.ecmaVersion >= 12 && len === void 0,

    isLegacyOctalNumericLiteral = maybeLegacyOctalNumericLiteral && this.input.charCodeAt(this.pos) === 48,

    start = this.pos, total = 0, lastCode = 0;
  for (var i = 0, e = len == null ? Infinity : len; i < e; ++i, ++this.pos) {
    var code = this.input.charCodeAt(this.pos), val = void 0;

    if (allowSeparators && code === 95) {
      isLegacyOctalNumericLiteral &&
        this.raiseRecoverable(this.pos, "Numeric separator is not allowed in legacy octal numeric literals");
      lastCode !== 95 || this.raiseRecoverable(this.pos, "Numeric separator must be exactly one underscore");
      i !== 0 || this.raiseRecoverable(this.pos, "Numeric separator is not allowed at the first of digits");
      lastCode = code;
      continue;
    }

    val = code >= 97 ? code - 97 + 10 : code >= 65 ? code - 65 + 10 : code >= 48 && code <= 57 ? code - 48 : Infinity;
    if (val >= radix) break;
    lastCode = code;
    total = total * radix + val;
  }

  allowSeparators && lastCode === 95 && this.raiseRecoverable(this.pos - 1, "Numeric separator is not allowed at the last of digits");
  return this.pos === start || (len != null && this.pos - start !== len) ? null : total;
};

function stringToNumber(str, isLegacyOctalNumericLiteral) {
  return isLegacyOctalNumericLiteral ? parseInt(str, 8) : parseFloat(str.replace(/_/g, ""));
}

function stringToBigInt(str) {
  return typeof BigInt != "function" ? null : BigInt(str.replace(/_/g, ""));
}

pp.readRadixNumber = function(radix) {
  var start = this.pos;
  this.pos += 2;
  var val = this.readInt(radix);
  val != null || this.raise(this.start + 2, "Expected number in radix " + radix);
  if (this.options.ecmaVersion >= 11 && this.input.charCodeAt(this.pos) === 110) {
    val = stringToBigInt(this.input.slice(start, this.pos));
    ++this.pos;
  } else isIdentifierStart(this.fullCharCodeAtPos()) && this.raise(this.pos, "Identifier directly after number");
  return this.finishToken(types$1.num, val);
};

pp.readNumber = function(startsWithDot) {
  var start = this.pos;
  startsWithDot || this.readInt(10, void 0, true) !== null || this.raise(start, "Invalid number");
  var octal = this.pos - start >= 2 && this.input.charCodeAt(start) === 48;
  octal && this.strict && this.raise(start, "Invalid number");
  var next = this.input.charCodeAt(this.pos);
  if (!octal && !startsWithDot && this.options.ecmaVersion >= 11 && next === 110) {
    var val$1 = stringToBigInt(this.input.slice(start, this.pos));
    ++this.pos;
    isIdentifierStart(this.fullCharCodeAtPos()) && this.raise(this.pos, "Identifier directly after number");
    return this.finishToken(types$1.num, val$1);
  }
  if (octal && /[89]/.test(this.input.slice(start, this.pos))) octal = false;
  if (next === 46 && !octal) {
    ++this.pos;
    this.readInt(10);
    next = this.input.charCodeAt(this.pos);
  }
  if ((next === 69 || next === 101) && !octal) {
    ((next = this.input.charCodeAt(++this.pos)) !== 43 && next !== 45) || ++this.pos;
    this.readInt(10) !== null || this.raise(start, "Invalid number");
  }
  isIdentifierStart(this.fullCharCodeAtPos()) && this.raise(this.pos, "Identifier directly after number");

  var val = stringToNumber(this.input.slice(start, this.pos), octal);
  return this.finishToken(types$1.num, val);
};

pp.readCodePoint = function() {
  var code;

  if (this.input.charCodeAt(this.pos) === 123) {
    this.options.ecmaVersion < 6 && this.unexpected();
    var codePos = ++this.pos;
    code = this.readHexChar(this.input.indexOf("}", this.pos) - this.pos);
    ++this.pos;
    code > 0x10FFFF && this.invalidStringToken(codePos, "Code point out of bounds");
  } else code = this.readHexChar(4);

  return code;
};

pp.readString = function(quote) {
  var out = "", chunkStart = ++this.pos;
  for (;;) {
    this.pos < this.input.length || this.raise(this.start, "Unterminated string constant");
    var ch = this.input.charCodeAt(this.pos);
    if (ch === quote) break;
    if (ch === 92) {
      out += this.input.slice(chunkStart, this.pos);
      out += this.readEscapedChar(false);
      chunkStart = this.pos;
    } else if (ch === 0x2028 || ch === 0x2029) {
      this.options.ecmaVersion < 10 && this.raise(this.start, "Unterminated string constant");
      ++this.pos;
      if (this.options.locations) {
        this.curLine++;
        this.lineStart = this.pos;
      }
    } else {
      isNewLine(ch) && this.raise(this.start, "Unterminated string constant");
      ++this.pos;
    }
  }
  out += this.input.slice(chunkStart, this.pos++);
  return this.finishToken(types$1.string, out);
};

var INVALID_TEMPLATE_ESCAPE_ERROR = {};

pp.tryReadTemplateToken = function() {
  this.inTemplateElement = true;
  try {
    this.readTmplToken();
  } catch (err) {
    if (err !== INVALID_TEMPLATE_ESCAPE_ERROR) throw err;

    this.readInvalidTemplateToken();
  }

  this.inTemplateElement = false;
};

pp.invalidStringToken = function(position, message) {
  if (this.inTemplateElement && this.options.ecmaVersion >= 9) throw INVALID_TEMPLATE_ESCAPE_ERROR;

  this.raise(position, message);
};

pp.readTmplToken = function() {
  for (var out = "", chunkStart = this.pos; ; ) {
    this.pos < this.input.length || this.raise(this.start, "Unterminated template");
    var ch = this.input.charCodeAt(this.pos);
    if (ch === 96 || (ch === 36 && this.input.charCodeAt(this.pos + 1) === 123)) {
      if (this.pos === this.start && (this.type === types$1.template || this.type === types$1.invalidTemplate)) {
        if (ch === 36) {
          this.pos += 2;
          return this.finishToken(types$1.dollarBraceL);
        }

        ++this.pos;
        return this.finishToken(types$1.backQuote);
      }
      out += this.input.slice(chunkStart, this.pos);
      return this.finishToken(types$1.template, out);
    }
    if (ch === 92) {
      out += this.input.slice(chunkStart, this.pos);
      out += this.readEscapedChar(true);
      chunkStart = this.pos;
    } else if (isNewLine(ch)) {
      out += this.input.slice(chunkStart, this.pos);
      ++this.pos;
      switch (ch) {
      case 13:
        this.input.charCodeAt(this.pos) !== 10 || ++this.pos;
      case 10:
        out += "\n";
        break;
      default:
        out += String.fromCharCode(ch);
        break;
      }
      if (this.options.locations) {
        ++this.curLine;
        this.lineStart = this.pos;
      }
      chunkStart = this.pos;
    } else ++this.pos;
  }
};

pp.readInvalidTemplateToken = function() {
  for (; this.pos < this.input.length; this.pos++)
    switch (this.input[this.pos]) {
    case "\\":
      ++this.pos;
      break;

    case "$":
      if (this.input[this.pos + 1] !== "{") break;

    case "`":
      return this.finishToken(types$1.invalidTemplate, this.input.slice(this.start, this.pos));
    }

  this.raise(this.start, "Unterminated template");
};

pp.readEscapedChar = function(inTemplate) {
  var ch = this.input.charCodeAt(++this.pos);
  ++this.pos;
  switch (ch) {
  case 110: return "\n";
  case 114: return "\r";
  case 120: return String.fromCharCode(this.readHexChar(2));
  case 117: return codePointToString(this.readCodePoint());
  case 116: return "\t";
  case 98: return "\b";
  case 118: return "\v";
  case 102: return "\f";
  case 13:
    this.input.charCodeAt(this.pos) !== 10 || ++this.pos;
  case 10:
    if (this.options.locations) {
      this.lineStart = this.pos;
      ++this.curLine;
    }
    return "";
  case 56:
  case 57:
    this.strict && this.invalidStringToken(this.pos - 1, "Invalid escape sequence");

    if (inTemplate) {
      var codePos = this.pos - 1;

      this.invalidStringToken(codePos, "Invalid escape sequence in template string");
    }
  default:
    if (ch >= 48 && ch <= 55) {
      var octalStr = this.input.substr(this.pos - 1, 3).match(/^[0-7]+/)[0],
        octal = parseInt(octalStr, 8);
      if (octal > 255) {
        octalStr = octalStr.slice(0, -1);
        octal = parseInt(octalStr, 8);
      }
      this.pos += octalStr.length - 1;
      ch = this.input.charCodeAt(this.pos);
      (octalStr !== "0" || ch === 56 || ch === 57) && (this.strict || inTemplate) &&
        this.invalidStringToken(
          this.pos - 1 - octalStr.length,
          inTemplate ? "Octal literal in template string" : "Octal literal in strict mode"
        );

      return String.fromCharCode(octal);
    }

    return isNewLine(ch) ? "" : String.fromCharCode(ch);
  }
};

pp.readHexChar = function(len) {
  var codePos = this.pos,
    n = this.readInt(16, len);
  n !== null || this.invalidStringToken(codePos, "Bad character escape sequence");
  return n;
};

pp.readWord1 = function() {
  this.containsEsc = false;
  var word = "", first = true, chunkStart = this.pos,
    astral = this.options.ecmaVersion >= 6;
  while (this.pos < this.input.length) {
    var ch = this.fullCharCodeAtPos();
    if (isIdentifierChar(ch, astral)) this.pos += ch <= 0xffff ? 1 : 2;
    else {
      if (ch !== 92) break;

      this.containsEsc = true;
      word += this.input.slice(chunkStart, this.pos);
      var escStart = this.pos;
      this.input.charCodeAt(++this.pos) === 117 || this.invalidStringToken(this.pos, "Expecting Unicode escape sequence \\uXXXX");
      ++this.pos;
      var esc = this.readCodePoint();
      (first ? isIdentifierStart : isIdentifierChar)(esc, astral) || this.invalidStringToken(escStart, "Invalid Unicode escape");
      word += codePointToString(esc);
      chunkStart = this.pos;
    }

    first = false;
  }
  return word + this.input.slice(chunkStart, this.pos);
};

pp.readWord = function() {
  var word = this.readWord1(),
    type = types$1.name;
  if (this.keywords.test(word)) type = keywords[word];

  return this.finishToken(type, word);
};

var version = "8.11.3";

Parser.acorn = {
  Parser: Parser,
  version: version,
  defaultOptions: defaultOptions,
  Position: Position,
  SourceLocation: SourceLocation,
  getLineInfo: getLineInfo,
  Node: Node,
  TokenType: TokenType,
  tokTypes: types$1,
  keywordTypes: keywords,
  TokContext: TokContext,
  tokContexts: types,
  isIdentifierChar: isIdentifierChar,
  isIdentifierStart: isIdentifierStart,
  Token: Token,
  isNewLine: isNewLine,
  lineBreak: lineBreak,
  lineBreakG: lineBreakG,
  nonASCIIwhitespace: nonASCIIwhitespace
};

function parse(input, options) {
  return Parser.parse(input, options);
}

function parseExpressionAt(input, pos, options) {
  return Parser.parseExpressionAt(input, pos, options);
}

function tokenizer(input, options) {
  return Parser.tokenizer(input, options);
}

exports.Node = Node;
exports.Parser = Parser;
exports.Position = Position;
exports.SourceLocation = SourceLocation;
exports.TokContext = TokContext;
exports.Token = Token;
exports.TokenType = TokenType;
exports.defaultOptions = defaultOptions;
exports.getLineInfo = getLineInfo;
exports.isIdentifierChar = isIdentifierChar;
exports.isIdentifierStart = isIdentifierStart;
exports.isNewLine = isNewLine;
exports.keywordTypes = keywords;
exports.lineBreak = lineBreak;
exports.lineBreakG = lineBreakG;
exports.nonASCIIwhitespace = nonASCIIwhitespace;
exports.parse = parse;
exports.parseExpressionAt = parseExpressionAt;
exports.tokContexts = types;
exports.tokTypes = types$1;
exports.tokenizer = tokenizer;
exports.version = version;
