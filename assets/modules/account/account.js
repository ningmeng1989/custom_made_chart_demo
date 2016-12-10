/*!***********************************************
 Copyright (c) 2016, Neusoft Inc.
 All rights reserved
 SaCa DataViz Version 3.1.0
 ************************************************/
angular.module("app.account", []).constant("accountConfig", {}), angular.module("app.account").controller("accountListCtrl", ["$scope", "$rootScope", "$timeout", "$modal", "toaster", "uiGridConstants", "accountService", function (e, t, n, o, c, r, i) {
    function a(e) {
        e.getAccountState = function () {
            switch (this.accountState) {
                case 1:
                    return "正常";
                case-1:
                    return "未激活"
            }
        }, e.getTimeCreate = function () {
            return this.createDate ? new Date(parseInt(this.createDate)).format("yyyy-MM-dd hh:mm:ss") : null
        }, e.getTimeLogin = function () {
            return this.lastLogin ? new Date(parseInt(this.lastLogin)).format("yyyy-MM-dd hh:mm:ss") : null
        }, e.isAdministrator = function () {
            return this.isAdmin ? "是" : "否"
        }
    }

    e.gridHandlers = {
        onDblClick: function (t) {
            e.modifyAccount()
        }
    }, e.gridOptions = {
        rowHeight: 30,
        enableRowSelection: !0,
        enableRowHeaderSelection: !1,
        multiSelect: !1,
        noUnselect: !0,
        selectionRowHeaderWidth: 30,
        enableColumnMenus: !1,
        columnDefs: [{field: "name", displayName: "用户名称"}, {
            field: "loginName",
            displayName: "登录名称"
        }, {
            field: "getAccountState()",
            displayName: "用户状态",
            filter: {type: r.filter.SELECT, selectOptions: [{value: 1, label: "正常"}, {value: -1, label: "失效"}]}
        }, {field: "getTimeCreate()", displayName: "创建时间"}, {
            field: "getTimeLogin()",
            displayName: "上次登录时间"
        }, {field: "isAdministrator()", displayName: "是否管理员"}],
        onRegisterApi: function (t) {
            e.gridApi = t, t.selection.on.rowSelectionChanged(e, function (t) {
                e.currentAccount = t.entity
            })
        },
        rowTemplate: '<div ng-dblclick="getExternalScopes().onDblClick(row)" ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader }" ui-grid-cell></div>'
    }, e.$watch("app.settings.asideFolded", function () {
        setTimeout(function () {
            e.gridApi.core.handleWindowResize()
        }, 200)
    }), e.accountStates = [{name: "正常", value: 1}, {name: "未激活", value: -1}], i.getAccountList().then(function (t) {
        e.gridOptions.data = t, _.each(t, function (e) {
            a(e)
        }), n(function () {
            e.gridApi.selection.selectRow(e.gridOptions.data[0])
        })
    }), e.addAccount = function () {
        e.isNew = !0;
        var t = o.open({
            scope: e,
            templateUrl: "modules/account/account-info.html",
            controller: "accountInfoCtrl",
            backdrop: "static"
        });
        t.result.then(function (t) {
            i.addAccount(t).then(function (t) {
                c.pop("success", "", "添加账号成功"), a(t), e.gridOptions.data.push(t), setTimeout(function () {
                    e.gridApi.selection.selectRow(t)
                })
            }, function (e) {
                c.pop("error", "", e)
            })
        })
    }, e.modifyAccount = function () {
        e.isNew = !1;
        var n = o.open({
            scope: e,
            templateUrl: "modules/account/account-info.html",
            controller: "accountInfoCtrl",
            backdrop: "static"
        });
        n.result.then(function (n) {
            i.modifyAccount(e.currentAccount.id, n).then(function () {
                c.pop("success", "", "修改账号成功"), e.currentAccount.name = n.name, e.currentAccount.loginName = n.loginName, e.currentAccount.accountState = n.accountState, t.userinfo.id === e.currentAccount.id && (t.userinfo = e.currentAccount)
            }, function (e) {
                c.pop("error", "", e)
            })
        })
    }, e.removeAccount = function () {
        var t = o.open({
            templateUrl: "modules/common/operation-confirm/operation-confirm.html",
            size: "sm",
            controller: ["$scope", "$modalInstance", function (e, t) {
                e.message = "确定要删除该账号吗？", e.dismiss = function () {
                    t.dismiss()
                }, e.submit = function () {
                    t.close()
                }
            }]
        });
        t.result.then(function () {
            i.deleteAccount(e.currentAccount.id).then(function () {
                c.pop("success", "", "删除账号成功");
                var t = _.findIndex(e.gridOptions.data, e.currentAccount.id);
                e.gridOptions.data.splice(t, 1), setTimeout(function () {
                    e.gridApi.selection.selectRow(e.gridOptions.data[0])
                })
            }, function (e) {
                c.pop("error", "", e)
            })
        })
    }
}]).controller("accountInfoCtrl", ["$scope", "$modalInstance", "toaster", function (e, t, n) {
    e.form = {resetPassword: !1}, e.isNew ? (e.form.header = "添加账号", e.temp = {accountState: 1}) : (e.form.header = "修改账号", e.form.isAdmin = e.currentAccount.isAdmin, e.temp = {
        name: e.currentAccount.name,
        loginName: e.currentAccount.loginName,
        accountState: e.currentAccount.accountState
    }), e.submit = function () {
        return e.temp.loginPassword !== e.temp.confirmPassword ? (n.pop("error", "", "两次输入的密码不一致，请重新输入"), !1) : void t.close(e.temp)
    }, e.dismiss = function () {
        t.dismiss()
    }
}]).factory("accountService", ["$http", "$q", "accountConfig", function (e, t, n) {
    var o = {"USERS-101": "用户名已存在", "USERS-104": "登录名已存在", "USERS-107": "操作被禁止"}, c = "操作失败";
    return {
        getAccountList: function () {
            var n = t.defer();
            return e({method: "get", url: charts_server + "/service/users/accounts/all"}).then(function (e) {
                if (e.data.error) {
                    var t = e.data.error.c, r = o[t] || c;
                    n.reject(r)
                } else n.resolve(e.data.object)
            }, function (e) {
                n.reject(c)
            }), n.promise
        }, addAccount: function (n) {
            var r = t.defer();
            return e({method: "post", url: charts_server + "/service/users/account", data: n}).then(function (e) {
                if (e.data.error) {
                    var t = e.data.error.c, n = o[t] || c;
                    r.reject(n)
                } else r.resolve(e.data.object)
            }, function (e) {
                r.reject(c)
            }), r.promise
        }, modifyAccount: function (n, r) {
            var i = t.defer();
            return e({method: "put", url: charts_server + "/service/users/account/" + n, data: r}).then(function (e) {
                if (e.data.error) {
                    var t = e.data.error.c, n = o[t] || c;
                    i.reject(n)
                } else i.resolve()
            }, function (e) {
                i.reject(c)
            }), i.promise
        }, deleteAccount: function (n) {
            var r = t.defer();
            return e({method: "delete", url: charts_server + "/service/users/account/" + n}).then(function (e) {
                if (e.data.error) {
                    var t = e.data.error.c, n = o[t] || c;
                    r.reject(n)
                } else r.resolve(e.data.object)
            }, function (e) {
                r.reject(c)
            }), r.promise
        }
    }
}]);