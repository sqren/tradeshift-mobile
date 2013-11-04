app.controller('ActivityController', ['$scope', '$routeParams', 'angularFire', '$rootScope', 'helpers', function ($scope, $routeParams, angularFire, $rootScope, helpers) {

  'use strict';

  var companyId             = $routeParams.company_id,
      currentUserCompany    = $rootScope.currentUser.company,
      activityId            = helpers.getActivityId($rootScope.currentUser.company, companyId),

      // Get Firebase data
      companyRef            = new Firebase($rootScope.fireBaseUrl + "/companies/" + companyId),
      currentUserCompanyRef = new Firebase($rootScope.fireBaseUrl + "/companies/" + currentUserCompany),
      productsRef           = new Firebase($rootScope.fireBaseUrl + "/companies/" + currentUserCompany + "/products"),
      activityRef           = new Firebase($rootScope.fireBaseUrl + "/activities/" + activityId),
      usersRef              = new Firebase($rootScope.fireBaseUrl + "/users/");


  // Prepare scope variables
  $scope.company = {};
  $scope.activity = {};
  $scope.products = {};
  $scope.users = {};
  $scope.newActivity = {
    user: angular.copy($rootScope.currentUser),
  };
  $scope.selectedPrice = 0;
  $scope.currentUser = $rootScope.currentUser;

  // Bind firebase to scope
  angularFire(companyRef, $scope, 'company');
  angularFire(activityRef, $scope, 'activity');
  angularFire(productsRef, $scope, 'products');
  angularFire(usersRef, $scope, 'users');

  // Sune's stuff
  $scope.addItem = function() {
    $('.picker').show();
  };

  $scope.hidePickers = function() {
    $('.picker').hide();
    $('.product-picker').hide();
    $('.select-picker').hide();
    $('.newProduct-picker').hide();
    $('.lineActions-picker').hide();
  };

  $scope.addProduct = function() {
    $('.product-picker').show();
  };

  $scope.showAddNewProduct = function() {
    $('.newProduct-picker').show();
  };

  $scope.selectProduct = function(product) {
    $scope.newActivity.product = angular.copy(product);
    $('.select-picker').show();
  };

  $scope.selectPrice = function(price, e) {
    $scope.newActivity.product.custom_price = price;
  };

  $scope.generateInvoice = function() {
    $scope.hidePickers();
    $('.creator').html("<input type='checkbox' checked value='test'>");
    $('.transactions').prepend("<div class='generate'><p>5 items worth 120.000 excl tax (150.000 incl) selected</p><a class='button' >Generate invoice <i class='fa fa-cogs'></i></a></div");
  };

  $scope.saveNewActivity = function() {
    activityRef.child('lines').push(angular.copy($scope.newActivity));
    $scope.hidePickers();
  };

  $scope.setQuantity = function(val) {
    $scope.newActivity.product.quantity = val;
  };

  $scope.lineAction = function(lineId) {
    $('.picker').show();
    $('.lineActions-picker').show();
  };

  $scope.addNewProduct = function() {

    productsRef.push({
      title: $('.newProduct input[name="title"]').val(),
      price: $('.newProduct input[name="price"]').val(),
      currency: $('.newProduct input[name="currency"]').val(),
      tax: $('.newProduct input[name="tax"]').val()
    });

    $('.newProduct input').val('');
    $('.newProduct-picker').hide();
  };

}]);
