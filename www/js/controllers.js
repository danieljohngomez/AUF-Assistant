angular.module('starter.controllers', [])

.controller('ChatCtrl', function($scope, $filter, $timeout,
  $ionicScrollDelegate, $ionicLoading, LUIS) {
  $scope.messages = [];
  var responseData;
  var isIOS = ionic.Platform.isWebView() && ionic.Platform.isIOS();
  var isMobile = ionic.Platform.isWebView();

  $scope.sendMessage = function(message, isUser = true) {
    var d = new Date();
    d = d.toLocaleTimeString().replace(/:\d+ /, ' ');

    $scope.messages.push({
      isUser: isUser,
      text: message,
      time: d
    });

    if (isUser) {
      LUIS.query($scope.message).then(function(response) {
        var intent = $filter('getHighestIntentScore')(response.data);
        $scope.sendMessage(responseData[intent].response, false);

        if (intent == 'GoToWebsite' || intent == 'GoToFacebook') {
          var url = isMobile ? responseData[intent].parameters.urlMobile :
            responseData[intent].parameters.url;
          window.open(url, '_system', 'location=yes');
        }

        if (intent == 'GoToSchoolBliz') {
          var openUrl = function() {
            window.open(responseData[intent].parameters.url, '_system', 'location=yes');
          }
          if (isMobile) {
            var sApp = startApp.set({
              "action": "ACTION_MAIN",
              "category": "CATEGORY_DEFAULT",
              "package": "com.aufmschoolbliz.app"
            });

            sApp.start(function() {}, function(error) {
              openUrl();
            });
          } else
            openUrl();
        }

      });
    }

    delete $scope.message;
    $ionicScrollDelegate.scrollBottom(true);
  };

  $scope.inputUp = function() {
    if (isIOS) $scope.data.keyboardHeight = 216;
    $timeout(function() {
      $ionicScrollDelegate.scrollBottom(true);
    }, 300);

  };

  $scope.inputDown = function() {
    if (isIOS) $scope.data.keyboardHeight = 0;
    $ionicScrollDelegate.resize();
  };

  $scope.closeKeyboard = function() {
    // cordova.plugins.Keyboard.close();
  };

  $ionicLoading.show({
    template: 'Connecting...'
  });
  LUIS.getResponseData()
    .then(function(json) {
      $ionicLoading.hide();
      $scope.sendMessage("Hi! I'm Barbs, the AUF Assistant. You ask me anything about AUF. Try asking what I can do.", false);
      responseData = json.data;
    }, function(error) {
      $ionicLoading.show({
        template: 'Cannot connect to the server'
      });
    });
})

.controller('AboutCtrl', function($scope) {

});
