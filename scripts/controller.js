var myApp = angular.module('myApp',['ngTable','ngRoute']); //if not working remove ngTable from square brackets and leave it empty []

//Delete if not working
  myApp.config(function($routeProvider){
    $routeProvider
    .when('/',{
      controller: 'LoginCtrl',
      templateUrl: 'login/login.view.html'
    })
    .when('/dashboard',{
      resolve: {
        "check": function($location, $rootScope){
          if(!$rootScope.loggedIn){ //if its not logged in, redirect to login page
            $location.path('/');  //CHANGE THE PATH TO $location.path('/') AFTER ALL CHANGES ARE MADE

          }
        }
      },
      controller: 'DashboardCtrl',
      templateUrl: 'dashboard/dashboard.html'

    })
    .otherwise({
      redirectTo: '/'
    });

  });

  myApp.controller('LoginCtrl',function($scope, $location, $rootScope){

    $scope.dateNow = new Date(); //to get current date

    //NARAHENPITA USERNAME AND PASSWORD
    var globalUsername = "igniterspace"; 
    var globalPassword = "ecapsretingi";

    //GAMPAHA USERNAME AND PASSWORD
    var gampahaUsername = "ignitergampaha";
    var gampahaPassword = "ahapmagretingi";


    $scope.login = function(){

      if(($scope.username == globalUsername) && ($scope.password == globalPassword)){
        $rootScope.branch = "narahenpita";
        $rootScope.loggedIn = true;
        $location.path('/dashboard'); 


      }
      else if(($scope.username == gampahaUsername) && ($scope.password == gampahaPassword)){
        $rootScope.branch = "gampaha";
        $rootScope.loggedIn = true;
        $location.path('/dashboard');

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
      $("#dialog-error").dialog('option', 'title', errorTitle);
      $("#dialog-error").dialog('open');
          //can make this into a function with error title and error message
    }
//THIS FUNCTION IS TO DISPLAY SUCCESS MESSAGE
    $scope.successDialog = function(successTitle, successMessage){

      $scope.successTitle = successTitle;//title doesnt seem to work, so set errorTitle in this function
      $scope.successMessage = successMessage;
      $("#dialog-success").dialog('option', 'title', successTitle);
      $("#dialog-success").dialog('open');
    }


$( function() {
    $( "#dialog-error" ).dialog({
      autoOpen:false,
      resizable: false,
      height: "auto",
      width: 400,
      modal: true,
      buttons: {
        OK: function() {
          $( this ).dialog( "close" );
        }
      }
    });
  } );

  $( function() {
    $( "#dialog-success" ).dialog({
      autoOpen:false,
      resizable: false,
      height: "auto",
      width: 400,
      modal: true,
      buttons: {
        OK: function() {
          $( this ).dialog( "close" );
        }
      }
    });
  } );
  });

  //---------------------



  myApp.controller('DashboardCtrl', ['$scope', '$http','$filter', 'NgTableParams', '$location', '$anchorScroll','$window', function($scope, $http, $filter, NgTableParams, $location, $anchorScroll,$window) {

    $scope.dateNow = new Date(); //to get current date
    var globalUsername = "igniterspace";
    var globalPassword = "ecapsretingi";
    $scope.loading = false;

    
    //$scope.age_group_array = ["Beginner", "Master", "Leader"];

  




    $scope.age_group_array = {
    "type": "select", 
    "name": "",
    "value": "Beginner", 
    "values": [ "Beginner", "Master", "Leader"] 
    };


   

    



    
    //THIS FUNCTION IS TO MARK ATTENDANCE
    $scope.markAttendance = function(){
     // $route.reload();
     $scope.loadingGifMark=true;
      $scope.markingAtt = true;
      //if this url works, then try to put both in one script
      //alert("Student id is : "+$scope.studentid);
      var url = "https://script.google.com/macros/s/AKfycbxlIbgY8FNxTUHOJ4isajDPFGRBGwXS9Aovvf8urw9-SUakqBSn/exec?studentid="+$scope.studentid+"&batch="+$scope.batch+"&markattendance=true&branch="+$scope.$root.branch;
      $http.get(url)
      .then(function(response){
        if(response.data == "ATTENDANCE FAILED"){
          $scope.errorDialogDash("Attendance Failed", "Today is not a class date");
          $scope.markingAtt = false; //show the button
          $scope.loadingGifMark=false;
        }
        else if(response.data == "ATTENDANCE DUPLICATED"){
          $scope.errorDialogDash("Attendance already entered", "Attendance for this student has already been entered");
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
      var url = "https://script.google.com/macros/s/AKfycbzcvdl840bsB3nneQmL2AYApFlccl9N-KOQacIllXVlyOuHaUo/exec?studentid="+$scope.studentid+"&branch="+$scope.$root.branch;
      $http.get(url)
      .then(function(response){
        $scope.data = response.data;

        if(response.data == "NO ATTENDANCE RECORD"){
          $scope.viewingAtt = false;
          $scope.errorDialogDash("Attendance not found", "Student has not attended any classes yet");
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
       $scope.scrollTo();

} //else end

      });




    }

    //----------------------------------
$scope.hideAttendance = function(){
      $scope.viewingAtt = false;

      }


      //THIS FUNCTION IS TO ADD STUDENTS
  $scope.openAddStudentForm = function(){
    //$scope.results = false;
    $scope.add = true;
    $scope.scrollTo();



    //if data added  $scope.add=false

  }








//THIS FUNCTION IS TO GET THE NEW REGISTRATION NUMBER, OR TO CREATE A NEW REGISTRATION NUMBER IF ITS A NEW BATCH
$scope.getRegNo = function(){

  if($scope.batchAdd == ""){
    $scope.reg_noAdd = null;
    return;
  }

  if(($scope.batchAdd !=null) && ($scope.age_group_array.value!= null)){
    //if both these fields are filled then
    var url = "https://script.google.com/a/macros/igniterspace.com/s/AKfycbzmywTsQU2J4ZSAGSVi1CW8mnxbpdhEqaQNSJfORKU3_nZwLfo/exec?age_group="+$scope.age_group_array.value+"&batch="+$scope.batchAdd+"&branch="+$scope.$root.branch;
    $http.get(url)
    .then(function(response){
      console.log(response);
      //$scope.data = response.data;
      $scope.data = response.data;
      $scope.reg_noAdd = $scope.data.registrationNumber[0];
    });
  }else{
    //else leave registration number field empty??
    $scope.reg_noAdd = null;

  }

}


    //THIS FUNCTION IS TO GET THE STUDENT DETAILS WITH STUDENT ID
    //THIS FUNCTION ALSO GETS THE PAYMENT DETAILS
    $scope.getStudentByID = function(student_id){
      $scope.viewingAtt = false; //when page loads , attendance should not be shown
      

      if(!student_id){  //check if student_id is blank , null or whitespaces
        //if it is empty, call this custom error message function
       // $("#dialog-confirm").dialog('open');
        $scope.errorDialogDash("Empty Student Id", "Student Id field cannot be empty.");
      }else{
        $scope.loadingGif = true;
        $scope.studentid = student_id;
        $scope.results = false;
        $scope.loading = true;

        var url = "https://script.google.com/macros/s/AKfycbxlIbgY8FNxTUHOJ4isajDPFGRBGwXS9Aovvf8urw9-SUakqBSn/exec?studentid="+student_id+"&branch="+$scope.$root.branch;

        $http.get(url)
        .then(function(response){
          console.log(response);

          $scope.data = response.data;

          if($scope.data == "STUDENT DOES NOT EXIST"){
            $scope.errorDialogDash("Student does not exist", "Wrong Student Id has been entered. Please check it and try again!");
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
      $scope.displayInvoiceNumber = $scope.paymentArray[payment_index].invoice_no;

//$scope.pmt3



      document.getElementById('paymentFormDiv').style.display = "block";


      //------------------------------------------

    }

    //THIS FUNCTION IS TO CLOSRE THE VERIFY FORM
    $scope.closeForm = function(){
      
      document.getElementById('formDiv').style.display = "none";
    }



//THIS FUNCTION IS TO ADD THE PAYMENT DETAILS INTO THE DATABASE

  $scope.addStudent = function(){

    if(($scope.batchAdd) && ($scope.reg_noAdd) && ($scope.kids_nameAdd) && ($scope.ageAdd) && ($scope.parents_nameAdd) && ($scope.emailAdd) && ($scope.phoneAdd)){

      $scope.viewingAtt = false;
      $scope.reg_noAddFinal = $scope.batchAdd+""+$scope.reg_noAdd; //combine batch id with registration number to come up with final registration number , eg L + 1234 = L1234

      //alert($scope.reg_noAddFinal);

      //var url = "https://script.google.com/macros/s/AKfycbxlIbgY8FNxTUHOJ4isajDPFGRBGwXS9Aovvf8urw9-SUakqBSn/exec?studentid="+student_id;
      var url = "https://script.google.com/macros/s/AKfycbzmywTsQU2J4ZSAGSVi1CW8mnxbpdhEqaQNSJfORKU3_nZwLfo/exec?age_group="+$scope.age_group_array.value+"&batch="+$scope.batchAdd+"&reg_no="+$scope.reg_noAddFinal+"&kids_name="+
      $scope.kids_nameAdd+"&age="+$scope.ageAdd+"&parents_name="+$scope.parents_nameAdd+"&email="+$scope.emailAdd+"&phone="+$scope.phoneAdd+"&qr="+$scope.qr_codeAdd+"&branch="+$scope.$root.branch;

      $http.get(url)
      .then(function(response){
        if(response.data == -1){
          alert("STUDENT NOT ADDED")
        }
      });

      $scope.successDialog("Student added", "Student is successfully registered with IgniterSpace.");

      //clear all the text boxes
      $scope.batchAdd = null;
      $scope.reg_noAdd = null;
      $scope.reg_noAddFinal = null;
      $scope.kids_nameAdd = null;
      $scope.ageAdd = null;
      $scope.parents_nameAdd = null;
      $scope.emailAdd = null;
      $scope.phoneAdd = null;
      $scope.qr_codeAdd = null;
    }else{
      $scope.errorDialogDash("Registration Failed", "Please fill all the fields to register the student.");
    }

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
        var url = "https://script.google.com/macros/s/AKfycbzcvdl840bsB3nneQmL2AYApFlccl9N-KOQacIllXVlyOuHaUo/exec?studentid="+$scope.studentid+"&payment_type="+$scope.payment_type+"&amount="+$scope.amount+"&batch="+$scope.batch+"&invoice_no="+$scope.invoiceNumber+"&branch="+$scope.$root.branch;
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
        $scope.errorDialogDash("Login verification failed", "Enter the correct username and password to complete verification");
        $scope.closeForm();
      }

    }

    //THIS FUNCTION IS TO DISPLAY ERROR MESSAGE 

    $scope.errorDialogDash = function(errorTitle, errorMessage){

      $scope.errorTitle = errorTitle;//title doesnt seem to work, so set errorTitle in this function
      

      $scope.errorMessage = errorMessage;

     // $("dialog-confirm").setAttribute('title','HELLO WORLD');
    //document.getElementById('dialog-confirm').message = "none";


      $("#dialog-errorDash").dialog('option', 'title', errorTitle)

      $("#dialog-errorDash").dialog('open');
      

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




    $scope.scrollTo = function(){
      $('.main-panel').animate({
        scrollTop:$("#footerScroll").offset().top
      }, 2000);
    }




//-----

  $( function() {
    $( "#dialog-errorDash" ).dialog({
      autoOpen:false,
      resizable: false,
      height: "auto",
      width: 400,
      modal: true,
      buttons: {
        OK: function() {
          $( this ).dialog( "close" );
        }
      }
    });
  } );

  $( function() {
    $( "#dialog-success" ).dialog({
      autoOpen:false,
      resizable: false,
      height: "auto",
      width: 400,
      modal: true,
      buttons: {
        OK: function() {
          $( this ).dialog( "close" );
        }
      }
    });
  } );





  }]);
