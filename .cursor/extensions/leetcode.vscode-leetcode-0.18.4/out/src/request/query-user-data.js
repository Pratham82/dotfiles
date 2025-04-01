"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryUserData = void 0;
const shared_1 = require("../shared");
const httpUtils_1 = require("../utils/httpUtils");
const graphqlStr = `
    query globalData {
        userStatus {
            isPremium
            isVerified
            username
            avatar
            isSignedIn
        }
    }
`;
const queryUserData = () => __awaiter(void 0, void 0, void 0, function* () {
    return httpUtils_1.LcAxios(shared_1.getUrl("userGraphql"), {
        method: "POST",
        data: {
            query: graphqlStr,
            variables: {},
        },
    }).then((res) => res.data.data.userStatus);
});
exports.queryUserData = queryUserData;
//# sourceMappingURL=query-user-data.js.map