angular.module('starter.services', [])

.factory('LUIS', function ($http) {
    var ENDPOINT = "https://api.projectoxford.ai/luis/v1/application?id=0173fe80-257b-4b51-ad7b-f6d57dc75973&subscription-key=6877d3f35a4143fca8af481671c11a3c";
    return {
      query: function (query) {
        return $http.get(ENDPOINT + "&q=" + query);
      },
      getResponseData: function() {
        return $http.get('https://raw.githubusercontent.com/danieljohngomez/AUF-Assistant/master/www/data.json')
      }
    }
});
