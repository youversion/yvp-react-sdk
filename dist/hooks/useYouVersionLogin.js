"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processLoginCallback = exports.useYouVersionLogin = void 0;
var react_1 = require("react");
var YV_SESSION_KEY = 'yv_login_session';
var useYouVersionLogin = function (_a) {
    var appId = _a.appId, _b = _a.language, language = _b === void 0 ? 'en' : _b, _c = _a.requiredPerms, requiredPerms = _c === void 0 ? [] : _c, _d = _a.optionalPerms, optionalPerms = _d === void 0 ? [] : _d, onSuccess = _a.onSuccess, onError = _a.onError;
    var login = (0, react_1.useCallback)(function () {
        console.log('Starting login, generating session...');
        var session = Math.random().toString(36).substring(2, 15) +
            Math.random().toString(36).substring(2, 15);
        localStorage.setItem(YV_SESSION_KEY, session);
        console.log('Session stored:', session);
        var params = new URLSearchParams({
            app_id: appId,
            language: language,
            session: session,
        });
        if (requiredPerms.length > 0) {
            params.append('required_perms', requiredPerms.join(','));
        }
        if (optionalPerms.length > 0) {
            params.append('opt_perms', optionalPerms.join(','));
        }
        var loginUrl = "https://api-dev.youversion.com/auth/login?".concat(params.toString());
        window.open(loginUrl, 'yv-login-popup', 'width=600,height=800');
    }, [appId, language, requiredPerms, optionalPerms]);
    (0, react_1.useEffect)(function () {
        var handleMessage = function (event) {
            console.log('MESSAGE EVENT RECEIVED IN HOOK', event.data);
            if (event.origin !== window.location.origin) {
                return;
            }
            var _a = event.data, type = _a.type, data = _a.data;
            if (type !== 'yv-login-callback') {
                console.log('Ignoring message of type:', type);
                return;
            }
            var storedSession = localStorage.getItem(YV_SESSION_KEY);
            localStorage.removeItem(YV_SESSION_KEY);
            console.log('>>> DEBUGGING SESSION <<<');
            console.log('Stored in localStorage:', storedSession);
            console.log('Received from callback:', data.session);
            console.log('>>> END DEBUGGING <<<');
            if (data.session !== storedSession) {
                console.error('SESSION MISMATCH!');
                onError({ message: 'Session mismatch.' });
                return;
            }
            if (data.status === 'success') {
                onSuccess({
                    lat: data.lat,
                    yvpUserId: data.yvp_user_id,
                    grants: data.grants ? data.grants.split(',') : [],
                    session: data.session,
                });
            }
            else {
                onError({
                    message: 'Login failed.',
                    session: data.session,
                });
            }
        };
        console.log('Setting up message listener...');
        window.addEventListener('message', handleMessage);
        return function () {
            console.log('Cleaning up message listener.');
            window.removeEventListener('message', handleMessage);
        };
    }, []);
    return { login: login };
};
exports.useYouVersionLogin = useYouVersionLogin;
var processLoginCallback = function () {
    var params = new URLSearchParams(window.location.search);
    var data = {
        lat: params.get('lat'),
        status: params.get('status'),
        yvp_user_id: params.get('yvp_user_id'),
        grants: params.get('grants'),
        session: params.get('session'),
    };
    if (window.opener) {
        window.opener.postMessage({ type: 'yv-login-callback', data: data }, window.location.origin);
        window.close();
    }
    else {
        console.error('No opener window found. This page should be opened as a popup.');
    }
};
exports.processLoginCallback = processLoginCallback;
