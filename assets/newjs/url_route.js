MetronicApp.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
    $urlRouterProvider.otherwise('/dashboard');
    $stateProvider
    .state('dashboard', {
		url: '/dashboard',
		templateUrl: 'views/laboratory/list.html?'+VERSION,
		controller: 'Laboratory as CR',
		pageTitle : 'Laboratories',
    })
    .state('laboratories', {
		url: '/laboratories',
		templateUrl: 'views/laboratory/list.html?'+VERSION,
		controller: 'Laboratory as CR',
		pageTitle : 'Laboratories',
    })
    
    $locationProvider.html5Mode(true);
});