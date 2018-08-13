"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var monadic_react_1 = require("monadic_react");
var login = function (loginApi, messageHandler) {
    return function (role_to_string) { return function (roles) { return function (initAuthState) {
        return monadic_react_1.repeat('login_repeat')(monadic_react_1.any('login_form')([
            inner_login(role_to_string)(roles)(true),
            function (ld) { return monadic_react_1.button("Login", false, "login_button")(ld).then(undefined, function (ld) {
                return loginApi(ld.loginState).then(undefined, function (u) {
                    if (u.status == "failure") {
                        messageHandler(u.message);
                        return monadic_react_1.unit(__assign({}, ld, { user: monadic_react_1.none() }));
                    }
                    return monadic_react_1.unit(__assign({}, ld, { user: monadic_react_1.some(u.user), kind: "loggedin" }));
                });
            }); },
            function (ld) { return ld.resetState != null ? monadic_react_1.a("Forgot password?", null, null, false, "forgot_password")(__assign({}, ld, { kind: "requestreset" })) : monadic_react_1.unit(null).never(); },
            function (ld) { return ld.registerState != null ? monadic_react_1.a("Create an account", null, null, false, "register")(__assign({}, ld, { kind: "register" })) : monadic_react_1.unit(null).never(); }
        ]))(initAuthState).filter(function (newState) { return initAuthState.kind != newState.kind; }, 'login_filter');
    }; }; };
};
var inner_login = function (role_to_string) {
    return function (roles) { return function (show_password) {
        return monadic_react_1.repeat("inner_login_repeat")(monadic_react_1.any("inner_login_any")([
            monadic_react_1.retract("email_retract")(function (authState) { return authState.loginState.email; }, function (authState) { return function (v) { return (__assign({}, authState, { loginState: __assign({}, authState.loginState, { email: v }) })); }; }, monadic_react_1.label("Email", true, null, "email_label")(monadic_react_1.string("edit", "email", "email_input"))),
            show_password ?
                monadic_react_1.retract('password_retract')(function (authState) { return authState.loginState.password; }, function (authState) { return function (v) { return (__assign({}, authState, { loginState: __assign({}, authState.loginState, { password: v }) })); }; }, monadic_react_1.label("Password", true, null, "password_label")(monadic_react_1.string("edit", "password", "password_input")))
                : function (authState) { return monadic_react_1.unit(null).never("inner_login_password"); },
            monadic_react_1.retract('role_retract')(function (authState) { return authState.loginState.role; }, function (authState) { return function (v) { return (__assign({}, authState, { loginState: __assign({}, authState.loginState, { role: v }) })); }; }, monadic_react_1.label("Role", true, null, "role_label")(function (r) { return monadic_react_1.selector("dropdown", role_to_string, "role_selector")(roles, r); })),
        ]));
    }; };
};
var resetPasswordRequest = function (requestResetApi, messageHandler) {
    return function (role_to_string) { return function (roles) { return function (initAuthState) {
        return monadic_react_1.repeat('requestreset_repeat')(monadic_react_1.any('requestreset_form')([
            inner_login(role_to_string)(roles)(false),
            function (ld) { return monadic_react_1.button("Request reset", false, "request_reset_button")(ld).then(undefined, function (ld) {
                return requestResetApi(ld.loginState).then(undefined, function (result) {
                    result == "success" ? messageHandler("request_reset_success") : messageHandler("request_reset_failed");
                    return monadic_react_1.unit(ld);
                });
            }); },
            function (ld) { return monadic_react_1.a("Back to login", null, null, false, "back_to_login")(__assign({}, ld, { kind: "login" })); }
        ]))(initAuthState).filter(function (newState) { return initAuthState.kind != newState.kind; }, 'resetpasswordrequest_filter');
    }; }; };
};
var resetPassword = function (resetApi, messageHandler) {
    return function (role_to_string) { return function (roles) { return function (initAuthState) {
        return monadic_react_1.repeat('resetpassword_repeat')(monadic_react_1.any('reset_form')([
            inner_resetPassword(role_to_string)(roles),
            function (ld) { return monadic_react_1.button("Change password", false, "reset_button")(ld).then(undefined, function (ld) {
                return resetApi(ld.resetState).then(undefined, function (result) {
                    if (result == "failure") {
                        messageHandler("reset_failed");
                        return monadic_react_1.unit(__assign({}, ld, { kind: "reset" }));
                    }
                    messageHandler("reset_success");
                    return monadic_react_1.unit(__assign({}, ld, { kind: "login" }));
                });
            }); },
        ]))(initAuthState).filter(function (newState) { return initAuthState.kind != newState.kind; }, 'resetpassword_filter');
    }; }; };
};
var inner_resetPassword = function (role_to_string) {
    return function (roles) {
        return monadic_react_1.repeat("inner_reset_repeat")(monadic_react_1.any("inner_reset_any")([
            monadic_react_1.retract("new_password_retract")(function (authState) { return authState.resetState.new_password; }, function (authState) { return function (v) { return (__assign({}, authState, { resetState: __assign({}, authState.resetState, { new_password: v }) })); }; }, monadic_react_1.label("Password", true, null, "new_password_label")(monadic_react_1.string("edit", "password", "new_password_input"))),
            monadic_react_1.retract("new_password_confirm_retract")(function (authState) { return authState.resetState.new_password_confirm; }, function (authState) { return function (v) { return (__assign({}, authState, { resetState: __assign({}, authState.resetState, { new_password_confirm: v }) })); }; }, monadic_react_1.label("Confirm password", true, null, "new_password_confirm_label")(monadic_react_1.string("edit", "password", "new_password_confirm_input"))),
        ]));
    };
};
var changePassword = function (changeApi, messageHandler) {
    return function (role_to_string) { return function (initAuthState) {
        return monadic_react_1.repeat('changepassword_repeat')(monadic_react_1.any('reset_form')([
            function (authS) { return inner_changePassword()({ password: "", newPassword: "", newPasswordConfirmation: "" }).then(undefined, function (changeData) {
                return monadic_react_1.button("Change password", false, "reset_button")(authS).then(undefined, function (authS) {
                    return changeApi(changeData).then(undefined, function (result) {
                        if (result == "failure") {
                            messageHandler("change_password_failed");
                            return monadic_react_1.unit(authS);
                        }
                        messageHandler("change_password_success");
                        return monadic_react_1.unit(__assign({}, authS, { kind: "loggedin" }));
                    });
                });
            }); }
        ]))(initAuthState).filter(function (newState) { return initAuthState.kind != newState.kind; }, 'changepassword_filter');
    }; };
};
var inner_changePassword = function () {
    return monadic_react_1.repeat("inner_change-repeat")(monadic_react_1.any("inner_change-any")([
        monadic_react_1.retract("old_password_retract")(function (changeData) { return changeData.password; }, function (changeData) { return function (v) { return (__assign({}, changeData, { password: v })); }; }, monadic_react_1.label("Old Password", true, null, "old_password_label")(monadic_react_1.string("edit", "password", "old_password_input"))),
        monadic_react_1.retract("new_password_retract")(function (changeData) { return changeData.newPassword; }, function (changeData) { return function (v) { return (__assign({}, changeData, { newPassword: v })); }; }, monadic_react_1.label("New Password", true, null, "new_password_label")(monadic_react_1.string("edit", "password", "new_password_input"))),
        monadic_react_1.retract("new_password_confirm_retract")(function (changeData) { return changeData.newPasswordConfirmation; }, function (changeData) { return function (v) { return (__assign({}, changeData, { newPasswordConfirmation: v })); }; }, monadic_react_1.label("Confirm password", true, null, "new_password_confirm_label")(monadic_react_1.string("edit", "password", "new_password_confirm_input"))),
    ]));
};
var loggedin = function (logoutApi, messageHandler) {
    return monadic_react_1.any('logout_form')([
        function (ld) { return monadic_react_1.a("Logout", null, "nofollow", false, "logout_link")(ld).then("logout_api_call", function (ld) { return logoutApi(ld.loginState); }).then(undefined, function (_) {
            return monadic_react_1.unit(__assign({}, ld, { kind: "login", user: monadic_react_1.none(), loginState: { email: "", password: "", role: null } }));
        }); },
        function (ld) { return monadic_react_1.a("Change password", null, "nofollow", false, "change_password_link")(ld).then("change_password_kind", function (_) { return monadic_react_1.unit(__assign({}, ld, { kind: "changepassword" })); }); }
    ]);
};
var register = function (registerApi, messageHandler) {
    return function (role_to_string) { return function (roles) { return function (initAuthState) {
        return monadic_react_1.repeat('register_repeat')(monadic_react_1.any('register_form')([
            inner_register(role_to_string)(roles),
            function (ld) { return monadic_react_1.button("Register", false, "register_button")(ld).then(undefined, function (ld) {
                return registerApi(ld.registerState).then(undefined, function (result) {
                    if (result.status == "failure") {
                        messageHandler(result.message);
                        return monadic_react_1.unit(__assign({}, ld, { user: monadic_react_1.none(), kind: "register" }));
                    }
                    messageHandler("register_success");
                    return monadic_react_1.unit(__assign({}, ld, { kind: "login", user: monadic_react_1.some(result.user) }));
                });
            }); },
            function (ld) { return monadic_react_1.a("Back to login", null, null, false, "back_to_login")(__assign({}, ld, { kind: "login" })); }
        ]))(initAuthState).filter(function (newState) { return initAuthState.kind != newState.kind; }, 'register_filter');
    }; }; };
};
var inner_register = function (role_to_string) {
    return function (roles) {
        return monadic_react_1.repeat("inner_register_repeat")(monadic_react_1.any("inner_register_any")([
            monadic_react_1.retract("username_retract")(function (authState) { return authState.registerState.username; }, function (authState) { return function (v) { return (__assign({}, authState, { registerState: __assign({}, authState.registerState, { username: v }) })); }; }, monadic_react_1.label("Username", true, null, "username_label")(monadic_react_1.string("edit", "text", "username_input"))),
            monadic_react_1.retract("email_retract")(function (authState) { return authState.registerState.email; }, function (authState) { return function (v) { return (__assign({}, authState, { registerState: __assign({}, authState.registerState, { email: v }) })); }; }, monadic_react_1.label("Email", true, null, "email_label")(monadic_react_1.string("edit", "email", "email_input"))),
            monadic_react_1.retract("emailconfirm_retract")(function (authState) { return authState.registerState.emailConfirmation; }, function (authState) { return function (v) { return (__assign({}, authState, { registerState: __assign({}, authState.registerState, { emailConfirmation: v }) })); }; }, monadic_react_1.label("Confirm email", true, null, "emailconfirm_label")(monadic_react_1.string("edit", "email", "emailconfirm_input"))),
            monadic_react_1.retract("password_retract")(function (authState) { return authState.registerState.password; }, function (authState) { return function (v) { return (__assign({}, authState, { registerState: __assign({}, authState.registerState, { password: v }) })); }; }, monadic_react_1.label("Password", true, null, "password_label")(monadic_react_1.string("edit", "password", "password_input"))),
            monadic_react_1.retract("passwordConfirm_retract")(function (authState) { return authState.registerState.passwordConfirmation; }, function (authState) { return function (v) { return (__assign({}, authState, { registerState: __assign({}, authState.registerState, { passwordConfirmation: v }) })); }; }, monadic_react_1.label("Confirm password", true, null, "passwordConfirm_label")(monadic_react_1.string("edit", "password", "passwordConfirm_input"))),
            monadic_react_1.retract('role_retract')(function (authState) { return authState.registerState.role; }, function (authState) { return function (v) { return (__assign({}, authState, { registerState: __assign({}, authState.registerState, { role: v }) })); }; }, monadic_react_1.label("Role", true, null, "role_label")(function (r) { return monadic_react_1.selector("dropdown", role_to_string, "role_selector")(roles, r); })),
        ]));
    };
};
exports.Authenticate = function (loginApi, logoutApi, registerApi, requestResetApi, resetApi, changeApi, messageHandler) {
    return function (role_to_string) { return function (roles) {
        return monadic_react_1.repeat('authenticate')(monadic_react_1.any('authenticate_wrapper')([
            function (ld) {
                return ld.kind == "login" ?
                    login(loginApi, messageHandler)(role_to_string)(roles)(ld)
                    : ld.kind == "loggedin" ?
                        loggedin(logoutApi, messageHandler)(ld)
                        : ld.kind == "requestreset" ?
                            resetPasswordRequest(requestResetApi, messageHandler)(role_to_string)(roles)(ld)
                            : ld.kind == "reset" ?
                                resetPassword(resetApi, messageHandler)(role_to_string)(roles)(ld)
                                : ld.kind == "changepassword" ?
                                    changePassword(changeApi, messageHandler)(role_to_string)(ld)
                                    : register(registerApi, messageHandler)(role_to_string)(roles)(ld);
            }
        ]));
    }; };
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9naW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29tcG9uZW50cy9sb2dpbi50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLCtDQUEwSDtBQVcxSCxJQUFJLEtBQUssR0FBRyxVQUFnQixRQUFpRSxFQUFFLGNBQXlDO0lBQ3BJLE9BQU8sVUFBQyxjQUFtQyxJQUFLLE9BQUEsVUFBQyxLQUFVLElBQUssT0FBQSxVQUFBLGFBQWE7UUFDekUsT0FBQSxzQkFBTSxDQUFrQixjQUFjLENBQUMsQ0FDbkMsbUJBQUcsQ0FBbUMsWUFBWSxDQUFDLENBQUM7WUFDaEQsV0FBVyxDQUFPLGNBQWMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQztZQUM5QyxVQUFBLEVBQUUsSUFBSSxPQUFBLHNCQUFNLENBQWtCLE9BQU8sRUFBRSxLQUFLLEVBQUUsY0FBYyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxVQUFBLEVBQUU7Z0JBQzVFLE9BQUEsUUFBUSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFVBQUEsQ0FBQztvQkFDckMsSUFBSSxDQUFDLENBQUMsTUFBTSxJQUFJLFNBQVMsRUFBRTt3QkFDdkIsY0FBYyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQTt3QkFDekIsT0FBTyxvQkFBSSxjQUFzQixFQUFFLElBQUUsSUFBSSxFQUFFLG9CQUFJLEVBQUUsSUFBRSxDQUFBO3FCQUN0RDtvQkFFRCxPQUFPLG9CQUFJLGNBQXNCLEVBQUUsSUFBRSxJQUFJLEVBQUUsb0JBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxFQUFFLFVBQVUsSUFBRSxDQUFBO2dCQUMvRSxDQUFDLENBQUM7WUFQRixDQU9FLENBQUMsRUFSTCxDQVFLO1lBQ1gsVUFBQSxFQUFFLElBQUksT0FBQSxFQUFFLENBQUMsVUFB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