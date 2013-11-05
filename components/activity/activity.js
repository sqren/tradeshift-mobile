app.controller('ActivityController',
  ['$scope', '$routeParams', 'angularFire', '$rootScope', 'helpers', 'documentService', function ($scope, $routeParams, angularFire, $rootScope, helpers, documentService) {

  'use strict';

  var passiveCompanyId = $routeParams.company_id,
      activeUserCompanyId = $rootScope.activeUser.company,
      feedId = helpers.getActivityId($rootScope.activeUser.company, passiveCompanyId),

      // Get Firebase data
      passiveCompanyRef = new Firebase($rootScope.fireBaseUrl + "/companies/" + passiveCompanyId),
      productsRef = new Firebase($rootScope.fireBaseUrl + "/companies/" + activeUserCompanyId + "/products"),
      feedRef = new Firebase($rootScope.fireBaseUrl + "/feeds/" + feedId),
      usersRef = new Firebase($rootScope.fireBaseUrl + "/users/");

  // Prepare scope variables
  $scope.passiveCompany = {};
  $scope.feed = {};
  $scope.products = {};
  $scope.users = {};
  $scope.selectedPrice = 0;
  $scope.activeUser = $rootScope.activeUser;
  $scope.selectLinesForInvoiceMode = false;
  $scope.selectedLineIds = [];
  var clickedLineId = null;

  // Bind firebase to scope
  angularFire(passiveCompanyRef, $scope, 'passiveCompany');
  angularFire(feedRef, $scope, 'feed');
  angularFire(productsRef, $scope, 'products');
  angularFire(usersRef, $scope, 'users');

  // Sune's stuff
  $scope.addItem = function() {
    $scope.newActivity = {
      user: $rootScope.activeUser.id
    };
    $('.picker').show();
  };

  $scope.hidePickers = function() {

    $('.product-picker').hide();
    $('.select-picker').hide();
    $('.newProduct-picker').hide();
    $('.lineActions-picker').hide();
     $('.picker').hide();
  };

  $scope.addProduct = function() {
    $('.product-picker').show();
  };

  $scope.showAddNewProduct = function() {
    $('.newProduct-picker').show();
  };

  $scope.clickSelectLinesForInvoice = function() {
    $scope.selectLinesForInvoiceMode = true;

    // select all lines from beginning
    $scope.selectedLineIds = _.keys(this.feed.lines);

    //
    $scope.hidePickers();
  };

  $scope.getSelectedLinesTotal = function(){
    var total = 0;
    _.each($scope.selectedLineIds, function(lineId){
      var line = $scope.feed.lines[lineId];
      total += (line.product.quantity * line.product.custom_price);
    });
    return total;
  };

  $scope.getTotal = function(){
    var total = 0;
    var lines = $scope.feed.lines;
    _.each(lines, function(line){
      total += (line.product.quantity * line.product.custom_price);
    });
    return total;
  };

  // generate invoice from selected lines
  $scope.generateInvoice = function(){

    var invoice = feedRef.child('invoices').push();

    _.each($scope.selectedLineIds, function(lineId){
      var line = $scope.feed.lines[lineId];
      invoice.push(line, function removeLine(error){
        feedRef.child('lines').child(lineId).remove(function(){
          documentService.getUuid({
            invoice: $scope.feed.invoices[invoice.name()],
            senderCompany: helpers.getCompany(activeUserCompanyId),
            receiverCompany: helpers.getCompany(passiveCompanyId)
          }).success(function(){

          });
        });
        $scope.selectLinesForInvoiceMode = false;
        $scope.selectedLineIds = [];
      });
    });
  };

  /*********** New Activity ***************/
  $scope.setProduct = function(product) {
    $scope.newActivity.product = angular.copy(product);
    $('.select-picker').show();
  };

  $scope.setCustomPrice = function(price, e) {
    $scope.newActivity.product.custom_price = price;
  };

  $scope.setQuantity = function(val) {
    $scope.newActivity.product.quantity = val;
  };

  $scope.saveNewActivity = function() {
    // Save the feed
    feedRef.child('lines').push($scope.newActivity);
    $scope.hidePickers();
  };


  $scope.clickLine = function(lineId) {
    // click line to select/unselect for invoice
    if($scope.selectLinesForInvoiceMode){

      var selectedIndex = $scope.selectedLineIds.indexOf(lineId);
      // the line was already selected - de-select it!
      if(selectedIndex > -1){
        $scope.selectedLineIds.splice(selectedIndex, 1);
      // select the line
      }else{
        $scope.selectedLineIds.push(lineId);
      }

    // click line to edit/add comment
    }else{
      clickedLineId = lineId;
      $('.picker').show();
      $('.lineActions-picker').show();
    }
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

  $scope.postComment = function() {
    var comment = $('.comment-form textarea').val();
    feedRef.child('lines').child(clickedLineId).child('comments').push({
      comment: comment,
      user: $rootScope.activeUser.id
    });

    $('.picker').hide();
  };

}]);
