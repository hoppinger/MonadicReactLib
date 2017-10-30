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
                    if (u.kind == "none") {
                        messageHandler("login_failed");
                        return monadic_react_1.unit(ld);
                    }
                    return monadic_react_1.unit(__assign({}, ld, { user: u, kind: "loggedin" }));
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
                    result == "success" ? messageHandler("reset_success") : messageHandler("reset_failed");
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
            return monadic_react_1.unit(__assign({}, ld, { kind: "login", user: monadic_react_1.none(), loginState: { email: null, password: null, role: null } }));
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
                    if (result == "failure") {
                        messageHandler("register_failed");
                        return monadic_react_1.unit(__assign({}, ld, { kind: "register" }));
                    }
                    messageHandler("register_success");
                    return monadic_react_1.unit(__assign({}, ld, { kind: "login" }));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9naW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29tcG9uZW50cy9sb2dpbi50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLCtDQUEwSDtBQVUxSCxJQUFJLEtBQUssR0FBRyxVQUFnQixRQUFtRCxFQUFFLGNBQXlDO0lBQ3RILE1BQU0sQ0FBQyxVQUFDLGNBQW1DLElBQUssT0FBQSxVQUFDLEtBQVUsSUFBSyxPQUFBLFVBQUEsYUFBYTtRQUN6RSxPQUFBLHNCQUFNLENBQWtCLGNBQWMsQ0FBQyxDQUNuQyxtQkFBRyxDQUFtQyxZQUFZLENBQUMsQ0FBQztZQUNoRCxXQUFXLENBQU8sY0FBYyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDO1lBQzlDLFVBQUEsRUFBRSxJQUFJLE9BQUEsc0JBQU0sQ0FBa0IsT0FBTyxFQUFFLEtBQUssRUFBRSxjQUFjLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFVBQUEsRUFBRTtnQkFDNUUsT0FBQSxRQUFRLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsVUFBQSxDQUFDO29CQUNyQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUM7d0JBQ25CLGNBQWMsQ0FBQyxjQUFjLENBQUMsQ0FBQTt3QkFDOUIsTUFBTSxDQUFDLG9CQUFJLENBQWtCLEVBQUUsQ0FBQyxDQUFBO29CQUNwQyxDQUFDO29CQUVELE1BQU0sQ0FBQyxvQkFBSSxjQUFzQixFQUFFLElBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsVUFBVSxJQUFFLENBQUE7Z0JBQ3BFLENBQUMsQ0FBQztZQVBGLENBT0UsQ0FBQyxFQVJMLENBUUs7WUFDWCxVQUFBLEVBQUUsSUFBSSxPQUFBLEVBQUUsQ0FBQyxVQUFVLElBQUksSUFBSSxDQUFDLENBQUMs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