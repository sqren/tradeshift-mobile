app.controller('ActivityController', ['$scope', '$routeParams', 'angularFire', '$rootScope', function ($scope, $routeParams, angularFire, $rootScope) {

  'use strict';

  var createActivityHandle = function(company1, company2) {
    return (company1 < company2 ? company1 + "-" + company2 : company2 + "-" + company1);
  };

  var company_id      = $routeParams.company_id,
      currentCompany   = $rootScope.currentUser.company,
      activityId          = createActivityHandle($rootScope.currentUser.company, company_id),

      // Get Firebase data
      companyRef         = new Firebase("https://tradeshift-mobile.firebaseio.com/companies/" + company_id),
      currentCompanyRef  = new Firebase("https://tradeshift-mobile.firebaseio.com/companies/" + currentCompany),
      productsRef        = new Firebase("https://tradeshift-mobile.firebaseio.com/companies/" + my_company_id + "/products"),
      activityRef        = new Firebase("https://tradeshift-mobile.firebaseio.com/activities/" + activityId);

  // Prepare scope variables
  $scope.company = {};
  $scope.activity = {};
  $scope.products = {};
  $scope.new_activity = {};
  

  // Bind firebase to scope
  angularFire(companyRef, $scope, 'company');
  angularFire(activityRef, $scope, 'activity');
  angularFire(productsRef, $scope, 'products');

  // Sune's stuff
  $scope.addItem = function() {
    $('.picker').show();
  };

  $scope.hidePicker = function() {
    $('.picker').hide();
    $('.product-picker').hide();
    $('.select-picker').hide();
  };

  $scope.addProduct = function() {
    $('.product-picker').show();
  };

  $scope.selectProduct = function(product) {
    $scope.new_activity.product = product;
    $('.select-picker').show();
  };

  $scope.selectPrice = function(price) {
    $scope.new_activity.product.custom_price = price;
  }

  $scope.save = function() {
    $scope.activities.push($scope.new_activity);
  };

}]);
