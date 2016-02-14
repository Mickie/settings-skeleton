var proCustom = angular.module('proCustom', ['ngRoute']);
proCustom.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/login', {
            templateUrl: 'login.html',
            controller: 'loginCtrl'
        })
        .when('/voucherLists', {
            templateUrl: 'voucherLists.html',
            controller: 'listsCtrl'
        })
        .when('/shareLists', {
            templateUrl: 'shareLists.html',
            controller: 'shareListsCtrl'
        })
        .when('/newsLists', {
            templateUrl: 'newsLists.html',
            controller: 'newsListsCtrl'
        })
        .otherwise('', {
            templateUrl: 'login.html',
            controller: 'loginCtrl'
        })
}])

proCustom.controller('loginCtrl', function ($rootScope,$scope,$location) {
    localStorage.setItem('usr',null);
    $rootScope.usr = null;
    $scope.login = function(){
        var usr = $('#username').val();
        var psw = $('#password').val();
        var res = true;
        if(res){
            $rootScope.usr = usr;
            localStorage.setItem('usr',usr);
            var page = localStorage.getItem('page');
            if(page == 2){
                $location.path('/shareLists');
            }else if(page ==3){
                $location.path('/newsLists');
            }else{
                $location.path('/voucherLists');
            }
        }
    }
})
proCustom.controller('indexCtrl',function($scope,$rootScope,$location){
    $rootScope.usr = localStorage.getItem('usr');
    $location.path('/voucherLists');
})
proCustom.controller('listsCtrl', function ($scope,$rootScope,$http,validData,$location) {
    $rootScope.usr = localStorage.getItem('usr');
    if(!$rootScope.usr){
        $location.path('/login');
    }
    $rootScope.page = 1;
    localStorage.setItem('page',1);

    $scope.getLists = function () {
        //http get lists ...
    }

    $scope.newVoucher = function () {
        $('#newModal').modal();
    }

    $scope.submitNew = function () {
        var newData = $scope.data;
        var validResult = validData.isValid(6,newData);
        if (!validResult) {
            alert('所有数据必填');
            return;
        }
        //http post if success pgrefresh
        $('#newModal').modal('hide');
        $scope.data = {};
        window.location.reload();
    }

    $scope.editPro = function (index) {
        $scope.curData = $scope.datas[index];
        $scope.curData.proStartDate = new Date($scope.curData.proStartDate);
        $('#editModal').modal();
    }

    $scope.activate = function (index) {
        $scope.curData = $scope.datas[index];
    }

    $scope.disAct = function (index) {
        $scope.curData = $scope.datas[index];
        $('#delModal').modal();
    }
    $scope.submitDel = function () {

    }

    $scope.getLists();

})

proCustom.controller('shareListsCtrl', function ($scope, $rootScope,$http, $sce,fileUploader,validData,$location) {
    $rootScope.usr = localStorage.getItem('usr');
    if(!$rootScope.usr){
        $location.path('/login');
    }
    $rootScope.page = 2;
    localStorage.setItem('page',2);

    //http get ...


    $scope.newShare = function () {
        $('#newModal').modal();
    }

    $scope.uploadImg = function (el) {
          var url ="/bonus/api/uploadImg";
          var uploadResult = fileUploader.uploadFile(el, url, $scope);
          if(!!uploadResult ){
              if(uploadResult.success){
                  $scope.data.imgUrl =$sce.trustAsResourceUrl(uploadResult.data.imgUrl);
              }else{
                  alert(uploadResult.errMsg);
              }
          }
    }

    $scope.submitShare = function () {
        var newData = $scope.data;
        var validResult = validData.isValid(4,newData);
        if (!validResult) {
            alert('所有数据必填');
            return;
        }
        //http post if success pgrefresh
        $scope.data ={};
        window.location.reload();
    }

    $scope.disAct= function(index){
        $scope.curData = $scope.datas[index];
        $('#delModal').modal();
    }
    $scope.submitDel = function(){
        $.ajax({
            url:'/bonus/api/offlinePage',
            type:'POST',
            data:{id:$scope.curData.id,reason:$scope.reason},
            success:function(data){
                var res = JSON.parse(data);
                if(res.success){
                    $scope.reason = "";
                }else{
                    alert(res.errMsg);
                }
            },error:function(){
                alert('网络连接错误');
            }
        })
    }
    $scope.checkAct = function(index){
        $scope.curData = $scope.datas[index];
        $('#editModal').modal();
    }
})

proCustom.controller('newsListsCtrl',function($scope,$rootScope,$http,$sce,fileUploader,validData,lengthLimit,$location){
    $rootScope.usr = localStorage.getItem('usr');
    if(!$rootScope.usr){
        $location.path('/login');
    }
    $rootScope.page = 3;
    localStorage.setItem('page',3);

   // getLists ...

    $scope.newShare = function(){
        $('#newModal').modal();
    }
    $scope.editNews = function(index){
        $scope.curData = $scope.datas[index];
        $('#editModal').modal();
    }

    $scope.uploadIcon = function(el){
        var url ="/bonus/api/uploadImg";
        var uploadResult = fileUploader.uploadFile(el, url, $scope);
        if(!!uploadResult ){
            if(uploadResult.success){
                $scope.data.imgUrl =$sce.trustAsResourceUrl(uploadResult.data.imgUrl);
            }else{
                alert(uploadResult.errMsg);
            }
        }

    }
    $scope.limitLen = function(el){
        var len=50;
        lengthLimit.limit(el,len);
    }

    $scope.submitShare = function(){
        var newData = $scope.data;
        var validResult = validData.isValid(8,newData);
        if (!validResult) {
            alert('所有数据必填');
            return;
        }
        // http post ...

        $('#newModal').modal('hide');
    }
    $scope.disAct = function(index){
        $scope.curData = $scope.datas[index];
        $('#delModal').modal();
    }
    $scope.submitDel = function(){
       //...
    }
    $scope.disableAct = function(index){
        $scope.curData = $scope.datas[index];
        //post ...
    }
    $scope.submitEdit = function(){
        //window.location.reload
    }
})

proCustom.factory('validData', function () {
    return {
        isValid: function (paramLen, datas) {
            var count = 0;
            if (!datas) {
                return false;
            }
            for (var i in datas) {
                //var data = $scope.data[i].replace(/(^\s*)|(\s*$)/g, "");
                var data = datas[i];
                if (data == "") {
                    return false;
                } else {
                    count++;
                }
            }
            return count >= paramLen;
        }
    }
})

proCustom.factory('fileUploader', function () {
    var createCORSRequest = function (method, url) {
        var xhr = new XMLHttpRequest();
        if ('withCredentials' in xhr) {
            xhr.open(method, url, true);
        } else if (typeof XDomainRequest != "undefined") { //ie 8
            xhr = new XDomainRequest();
            xhr.open(method, url);
        } else {
            xhr = null;
        }
        return xhr;
    }

    var sendRequest = function (el, url, $scope) {
        var file = el.files[0];
        $scope.$apply(function ($scope) {
            var formData = new FormData();
            formData.append('', file);
            var req = createCORSRequest('post', url);
            if (req) {
                req.onload = function () {
                    var result = JSON.parse(req.response);
                    //$scope.bannerUrl = $sce.trustAsResourceUrl();
                    return result;
                };
                req.onerror = function () {
                    alert('出错啦');
                    return false;
                };
                req.send(formData);
            }
        })
    }

    return {
        uploadFile:sendRequest
    }

})
proCustom.factory('lengthLimit',function(){
    var detectLength = function(el,maxLen){
        var str = el.value;
        console.log(str);
        if(str.length >=maxLen){
            el.value = str.substr(0,maxLen);
        }
    }
    return {limit:detectLength};
})

proCustom.filter('filterName',function(){
    return function(param){
        return null;
    }
})

