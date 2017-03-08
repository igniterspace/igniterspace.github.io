var myApp = angular.module('myApp',['ngTable','ngRoute']); //if not working remove ngTable from square brackets and leave it empty []

//Delete if not working
  myApp.config(function($routeProvider){
    $routeProvider
    .when('/',{
      templateUrl: '/index.html',
      controller: 'LoginCtrl'
    })
    .when('/dashboard',{
      templateUrl: './dashboard.html', //change this later 
      controller: 'DashboardCtrl'
    })
    .otherwise({
      redirectTo: '/'
    });
  });

  myApp.controller('LoginCtrl',function($scope, $location){

    $scope.dateNow = new Date(); //to get current date

    $scope.login = function(){
      var uname =$scope.username;
      var password = $scope.password;
      if($scope.username== 'admin' && $scope.password=='admin'){
        $location.path('/dashboard'); //TRY TO MAKE THIS ANGULAR WAY WORK INSTEAD
        //window.location.hash = '#/index';
        //$scope.successDialog("Login successful", "Welcome to Igniter Space!!");
        //window.location.href = 'index.html#/';
          //$scope.$apply();
      }
      else
      {
              
        $scope.errorDialog("Login failed!","Please make sure username and password are correct before logging in.")
      }

    };




        //THIS FUNCTION IS TO DISPLAY ERROR MESSAGE 

    $scope.errorDialog = function(errorTitle, errorMessage){

      $scope.errorTitle = errorTitle;//title doesnt seem to work, so set errorTitle in this function
      

      $scope.errorMessage = errorMessage;

     // $("dialog-confirm").setAttribute('title','HELLO WORLD');
    //document.getElementById('dialog-confirm').message = "none";

      $("#dialog-error").dialog('option', 'title', errorTitle)

      $("#dialog-error").dialog('open');
      

          //can make this into a function with error title and error message
    }



//THIS FUNCTION IS TO DISPLAY SUCCESS MESSAGE

    $scope.successDialog = function(successTitle, successMessage){

      $scope.successTitle = successTitle;//title doesnt seem to work, so set errorTitle in this function
      

      $scope.successMessage = successMessage;

     // $("dialog-confirm").setAttribute('title','HELLO WORLD');
    //document.getElementById('dialog-confirm').message = "none";

      $("#dialog-success").dialog('option', 'title', successTitle)

      $("#dialog-success").dialog('open');
    }

  });

  //---------------------



	myApp.controller('DashboardCtrl', ['$scope', '$http','$filter', 'NgTableParams', '$location', '$anchorScroll','$window', function($scope, $http, $filter, NgTableParams, $location, $anchorScroll,$window) {

    $scope.dateNow = new Date(); //to get current date
    var globalUsername = "igniter";
    var globalPassword = "1";

  


  	$scope.loading = false;
    //THIS FUNCTION IS TO MARK ATTENDANCE
  	$scope.markAttendance = function(){
     // $route.reload();
     $scope.loadingGifMark=true;
  		$scope.markingAtt = true;
  		//if this url works, then try to put both in one script
  		//alert("Student id is : "+$scope.studentid);
  		var url = "https://script.google.com/macros/s/AKfycbxlIbgY8FNxTUHOJ4isajDPFGRBGwXS9Aovvf8urw9-SUakqBSn/exec?studentid="+$scope.studentid+"&batch="+$scope.batch+"&markattendance=true";
  		$http.get(url)
  		.then(function(response){
  			if(response.data == "ATTENDANCE FAILED"){
          $scope.errorDialog("Attendance Failed", "Today is not a class date");
          $scope.markingAtt = false; //show the button
          $scope.loadingGifMark=false;
  			}
        else if(response.data == "ATTENDANCE DUPLICATED"){
          $scope.errorDialog("Attendance already entered", "Attendance for this student has already been entered");
          $scope.markingAtt = false; //FUTURE IMPROVEMENT : If attendance already entered, maybe disable button or show another message
          $scope.loadingGifMark=false;
        }
        else
        {
          $scope.successDialog("Attendance Saved", "Attendance has been saved successfully");
    			$scope.markingAtt = false;
          $scope.loadingGifMark=false;
          //$scope.results=false;//to get back to menu
          //$scope.student_id=null;//clear the student id box
        }
  		});
  	}


$scope.printMe = function(){
   var divToPrint=document.getElementById("panelAttendance");
   newWin= window.open("");
   newWin.document.write(divToPrint.outerHTML);
   newWin.print();
   newWin.close();
}


    //-------------------------------
    //THIS FUNCTION IS TO VIEW ATTENDANCE
    $scope.viewAttendance = function(){
      $scope.loadingGifView = true
      var url = "https://script.google.com/macros/s/AKfycbzcvdl840bsB3nneQmL2AYApFlccl9N-KOQacIllXVlyOuHaUo/exec?studentid="+$scope.studentid;
      $http.get(url)
      .then(function(response){
        $scope.data = response.data;

        if(response.data == "NO ATTENDANCE RECORD"){
          $scope.viewingAtt = false;
          $scope.errorDialog("Attendance not found", "Student has not attended any classes yet");
          $scope.loadingGifView=false;
        }else{
          $scope.viewingAtt = true;
          $scope.loadingGifView=false;
        //$scope.viewingAtt = false;
        //$scope.results = false; //to get back to menu
        


        //----USE A FOR LOOOP HERE--------------------------------------------

        $scope.AttDetails = [];
        
        for(var i=0; i<$scope.data.student_attendance.length; i++){
          $scope.AttDetails.push($scope.data.student_attendance[i]);
        }


      //--DELETE IF NOT WORKING
      $scope.AttTable = new NgTableParams({
        page: 1,
        count: 4,
        sorting: { date: 'desc' }
      }, {
        total: $scope.AttDetails.length,
        getData: function(params){
          $scope.data = params.sorting() ? $filter('orderBy')($scope.AttDetails, params.orderBy()) : $scope.AttDetails;
          $scope.data = params.filter() ? $filter('filter')($scope.data, params.filter()) : $scope.data;
          $scope.data = $scope.data.slice((params.page() - 1) * params.count(), params.page() * params.count());
          return $scope.data;
        }
      });
       //$("#panelAttendance").focus();
       //focusAttendance();
       
//scrollTo();

       scrollTo();

} //else end

      });




    }

    //----------------------------------
$scope.hideAttendance = function(){
      $scope.viewingAtt = false;

      }


//----------------------

    //THIS FUNCTION IS TO GET THE STUDENT DETAILS WITH STUDENT ID
    //THIS FUNCTION ALSO GETS THE PAYMENT DETAILS
  	$scope.getStudentByID = function(student_id){
      $scope.viewingAtt = false; //when page loads , attendance should not be shown
      

      if(!student_id){  //check if student_id is blank , null or whitespaces
        //if it is empty, call this custom error message function
       // $("#dialog-confirm").dialog('open');
        $scope.errorDialog("Empty Student Id", "Student Id field cannot be empty.");
      }else{
        $scope.loadingGif = true;
    		$scope.studentid = student_id;

    		$scope.results = false;

    		$scope.loading = true;

    		var url = "https://script.google.com/macros/s/AKfycbxlIbgY8FNxTUHOJ4isajDPFGRBGwXS9Aovvf8urw9-SUakqBSn/exec?studentid="+student_id;

    		$http.get(url)
    		.then(function(response){
    			console.log(response);

    			$scope.data = response.data;

    			if($scope.data == "STUDENT DOES NOT EXIST"){
    				$scope.errorDialog("Student does not exist", "Wrong Student Id has been entered. Please check it and try again!");
    				$scope.loading = false;
            $scope.loadingGif = false;
    			}else{


              $scope.loadingGif=false;
              $scope.loading=false;
              $scope.results=true;
              
              $scope.reg_no = $scope.data.students[0].reg_no;
              $scope.name = $scope.data.students[0].kids_name;
              $scope.age = $scope.data.students[0].age;
              $scope.age_group = $scope.data.students[0].age_group;
              $scope.batch = $scope.data.students[0].batch;
              $scope.parents_name = $scope.data.students[0].parents_name;
              $scope.email = $scope.data.students[0].email;
              $scope.phone = $scope.data.students[0].phone;
              $scope.qr_code = $scope.data.students[0].qr_code;


              //array to store payments
              $scope.paymentArray = [];

              //--Check if payments are done here
              if($scope.data.payments.length == 0){ //if array is empty
                //set everything to false again 
                $scope.registration = false;
                $scope.payment1 = false;
                $scope.payment2 = false;
                $scope.payment3 = false;
                $scope.payment4 = false;
                $scope.payment5 = false;
                $scope.payment6 = false;
              }else{
                //for registration we check if its filled AND if payment_type is set to registration
              if(($scope.data.payments[0].payment_type).toLowerCase() == "registration"){
                $scope.registration = true;
                $scope.paymentArray[0] = $scope.data.payments[0]; //assign value to a variable for use after attendance table loaded
              }else{
                $scope.registration = false;
              }

              //First monthly payment
              if($scope.data.payments[1]){
                $scope.payment1 = true;
                $scope.paymentArray[1] = $scope.data.payments[1]; //assign value to a variable for use after attendance table loaded

              }else{
                $scope.payment1 = false;
              }
              //Second monthly payment
              if($scope.data.payments[2]){
                $scope.payment2 = true;
                $scope.paymentArray[2] = $scope.data.payments[2]; //assign value to a variable for use after attendance table loaded
              }else{
                $scope.payment2 = false;
              }
              //Third monthly payment
              if($scope.data.payments[3]){
                $scope.payment3 = true;
                $scope.paymentArray[3] = $scope.data.payments[3]; //assign value to a variable for use after attendance table loaded
              }else{
                $scope.payment3 = false;
              }
              //Fourth monthly payment
              if($scope.data.payments[4]){
                $scope.payment4 = true;
                $scope.paymentArray[4] = $scope.data.payments[4]; //assign value to a variable for use after attendance table loaded
              }else{
                $scope.payment4 = false;
              }
              //Fifth monthly payment
              if($scope.data.payments[5]){
                $scope.payment5 = true;
                $scope.paymentArray[5] = $scope.data.payments[5]; //assign value to a variable for use after attendance table loaded
              }else{
                $scope.payment5 = false;
              }
              //Sixth monthly payment
              if($scope.data.payments[6]){
                $scope.payment6 = true;
                $scope.paymentArray[6] = $scope.data.payments[6]; //assign value to a variable for use after attendance table loaded
              }else{
                $scope.payment6 = false;
              }
            }//end of if empty array 
    			}



    		});

      }
  	}


    //THIS FUNCTION IS TO OPEN THE VERIFY FORM WHEN A PAYMENT IS CLICKED
    $scope.openForm = function(payment_type){

      //clear the textboxes
      $scope.amount = null;
      $scope.username = null;
      $scope.password = null;
      
      //if payment type is 0 its registration else it is monthly payment
      //This if statement is to display the payment type in the form and to set it to payment_type variable
      if(payment_type == 0){
        $scope.payment_type = "registration";
      }else
      if(payment_type == 1)
      {
        $scope.payment_type = "monthly1"
      }else
      if(payment_type == 2)
      {
        $scope.payment_type = "monthly2"
      }else
      if(payment_type == 3)
      {
        $scope.payment_type = "monthly3"
      }else
      if(payment_type == 4)
      {
        $scope.payment_type = "monthly4"
      }else
      if(payment_type == 5)
      {
        $scope.payment_type = "monthly5"
      }else
      if(payment_type == 6)
      {
        $scope.payment_type = "monthly6"
      }
      else{
        $scope.payment_type = "additional"
      }



      document.getElementById('formDiv').style.display = "block";
    }


    //THIS FUNCTION IS TO LOAD THE PAYMENT DETAILS AND DISPLAY IT IN THE WEBSITE

    $scope.openPaymentForm = function(type){

      //------------------------------------------
      var payment_index = type;

      $scope.displayPaymentDate = $scope.paymentArray[payment_index].date ;
      $scope.displayPaymentType = $scope.paymentArray[payment_index].payment_type;
      $scope.displayPaymentAmount = $scope.paymentArray[payment_index].amount;

//$scope.pmt3



      document.getElementById('paymentFormDiv').style.display = "block";


      //------------------------------------------

    }

    //THIS FUNCTION IS TO CLOSRE THE VERIFY FORM
    $scope.closeForm = function(){
      
      document.getElementById('formDiv').style.display = "none";
    }

    //THIS FORM IS TO CHECK THE DETAILS IN THE VERIFY FORM AND THEN ADD THE DETAILS TO PAYMENT GOOGLE SHEETS
    $scope.verifyPayment = function(username, password){
      //first hardcode the username and password, later use the google sheet
      var uname = globalUsername;
      var pass = globalPassword;






 // Fix issue with html5 validation
 //here we are giving time to validate payment form.
    if (form.checkValidity && !form.checkValidity()) {
      return;
    }



      //After form is submitted, check if login details are correct
      if((username == uname) && (password == pass)){
        //enter the details to the transaction database (payment_logs table)

        //-----------------------------------------
      var url = "https://script.google.com/macros/s/AKfycbzcvdl840bsB3nneQmL2AYApFlccl9N-KOQacIllXVlyOuHaUo/exec?studentid="+$scope.studentid+"&payment_type="+$scope.payment_type+"&amount="+$scope.amount+"&batch="+$scope.batch;
              $http.get(url)
              .then(function(response){
                if(response.data == -1){
                  alert("Invalid ! This is not the date of a class")
                }
                
              });

        //-----------------------------------------

        $scope.successDialog("Payment entered", "Payment entered successfully by verified user.");
        
        $scope.closeForm();



        //after payment is made set the payment buttons


      if($scope.payment_type == "registration"){
        $scope.registration = true;
      }else
      if($scope.payment_type == "monthly1")
      {
        $scope.payment1 = true;
      }else
      if($scope.payment_type == "monthly2")
      {
        $scope.payment2 = true;
      }else
      if($scope.payment_type == "monthly3")
      {
        $scope.payment3 = true;
      }else
      if($scope.payment_type == "monthly4")
      {
        $scope.payment4 = true;
      }else
      if($scope.payment_type == "monthly5")
      {
        $scope.payment5 = true;
      }else
      if($scope.payment_type == "monthly6")
      {
        $scope.payment6 = true;
      }
      
        
      }else{
        //display errorDialog and close the form
        $scope.errorDialog("Login verification failed", "Enter the correct username and password to complete verification");
        $scope.closeForm();
      }

    }

    //THIS FUNCTION IS TO DISPLAY ERROR MESSAGE 

    $scope.errorDialog = function(errorTitle, errorMessage){

      $scope.errorTitle = errorTitle;//title doesnt seem to work, so set errorTitle in this function
      

      $scope.errorMessage = errorMessage;

     // $("dialog-confirm").setAttribute('title','HELLO WORLD');
    //document.getElementById('dialog-confirm').message = "none";

      $("#dialog-error").dialog('option', 'title', errorTitle)

      $("#dialog-error").dialog('open');
      

          //can make this into a function with error title and error message
    }



//THIS FUNCTION IS TO DISPLAY SUCCESS MESSAGE

    $scope.successDialog = function(successTitle, successMessage){

      $scope.successTitle = successTitle;//title doesnt seem to work, so set errorTitle in this function
      

      $scope.successMessage = successMessage;

     // $("dialog-confirm").setAttribute('title','HELLO WORLD');
    //document.getElementById('dialog-confirm').message = "none";

      $("#dialog-success").dialog('option', 'title', successTitle)

      $("#dialog-success").dialog('open');
    }






    //THIS FUNCTION IS TO CLOSRE THE VERIFY FORM
    $scope.closePaymentForm = function(){
      
      document.getElementById('paymentFormDiv').style.display = "none";
    }




    $scope.login = function(){
      var user = globalUsername;
      var pass = globalPassword;

          //=-------

     


          //After form is submitted, check if login details are correct
          if(($scope.username == user) && ($scope.password == pass)){
            //enter the details to the transaction database (payment_logs table)
            
            $scope.successDialog("Login successful", "Welcome to Igniter Space!!");
            //$window.location.href = '/index.html';
            //$location.url('/index')
            $window.location.href = 'C:/Users/Nimaaz/Documents/igniterspace.github.io/index.html#/';
            }
            else
            {
              
              $scope.errorDialog("Login failed!","Please make sure username and password are correct before logging in.")
            }

          //=-------


    }


  }]);
