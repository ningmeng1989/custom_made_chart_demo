/**
 * Created by ChenZhuo on 2016/7/7.
 */
angular.module("app.datasource.datasourceedit", [])
    .factory("datassourceeditService", ["$http", "$q", function ($http, $q) {
        return {

            getDBtypelist: function () {
                var deferred = $q.defer();
                $http({
                    method: "GET",
                    url: charts_server + "/service/datasource/dbtypes"
                }).success(function (data) {
                    if (data.error) {
                        deferred.reject(data);
                    } else {
                        deferred.resolve(data);
                    }
                }).error(function (data) {
                    deferred.reject(data);
                });

                return deferred.promise;
            },

            createDataSource: function (datasource) {
                var deferred = $q.defer();
                $http({
                    method: "POST",
                    url: charts_server + "/service/datasource",
                    data: angular.toJson(datasource)
                }).success(function (data) {
                    if (data.error) {
                        deferred.reject(data);
                    } else {
                        deferred.resolve(data);
                    }
                }).error(function (data) {
                    deferred.reject(data);
                });

                return deferred.promise;
            },

            updateDataSource: function (datasource) {
                var deferred = $q.defer();
                $http({
                    method: "PUT",
                    url: charts_server + "/service/datasource",
                    data: angular.toJson(datasource)
                }).success(function (data) {
                    if (data.error) {
                        deferred.reject(data);
                    } else {
                        deferred.resolve(data);
                    }
                }).error(function (data) {
                    deferred.reject(data);
                });

                return deferred.promise;
            },

            testConnection: function (datasource) {
                var deferred = $q.defer();
                $http({
                    method: "POST",
                    url: charts_server + "/service/datasource/testConnection",
                    data: angular.toJson(datasource)
                }).success(function (data) {
                    if (data.error) {
                        deferred.reject(data);
                    } else {
                        deferred.resolve(data);
                    }
                }).error(function (data) {
                    deferred.reject(data);
                });

                return deferred.promise;
            }

        }
    }]).controller('datasourceeditCtrl', ["$scope", "$modalInstance", "selectDatasource", "datassourceeditService", "toaster", function ($scope, $modalInstance, selectDatasource, datassourceeditService, toaster) {

        if (selectDatasource) {
            $scope.title = "编辑";
            $scope.datasource = selectDatasource;
        } else {
            $scope.title = "新建";
            $scope.datasource = {kind: "rdb", access: {}};
        }

        datassourceeditService.getDBtypelist().then(function (data) {
            $scope.dbtypes = data.object;
            for (var i in $scope.dbtypes) {
                if ($scope.dbtypes[i].id == $scope.datasource.access.db_type) {
                    $scope.selecteddbtype = $scope.dbtypes[i];
                }
            }
        }, function (data) {
            $scope.dbtypes = [];
        });

        $scope.connectResult = "";
        $scope.isConnecting = false;
        $scope.testConnection = function () {
            $scope.connectResult = "";
            $scope.isConnecting = true;
            datassourceeditService.testConnection($scope.datasource).then(function (data) {
                if (data.object) {
                    $scope.connectResult = "success";
                } else {
                    $scope.connectResult = "fail";
                }
                $scope.isConnecting = false;
            }, function (data) {
                $scope.connectResult = "";
                $scope.isConnecting = false;
            });
        };

        $scope.$watch("selecteddbtype", function (value) {
            if (value) {
                $scope.datasource.access.db_type = value.id;
                if (!$scope.datasource.access.db_port) {
                    $scope.datasource.access.db_port = value.defaultPort;
                }
            }
        }, true);

        $scope.ok = function () {
            var promise;
            if (_.isEmpty($scope.datasource.id)) {
                promise = datassourceeditService.createDataSource($scope.datasource)
            } else {
                promise = datassourceeditService.updateDataSource($scope.datasource)
            }

            promise.then(function (data) {
                if (data.object != true) {
                    $scope.datasource = data.object;
                }
                $modalInstance.close($scope.datasource);
            }, function (data) {
                toaster.pop("error", "提示", "保存失败");
            });
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }]);