
//網頁應用程式碼
var firebaseConfig = {
    apiKey: "AIzaSyBAEfHCPVeRoj_taVdUGoHmgJjNtdgIS5U",
    authDomain: "test-web-bc0d7.firebaseapp.com",
    databaseURL: "https://test-web-bc0d7.firebaseio.com",
    projectId: "test-web-bc0d7",
    storageBucket: "test-web-bc0d7.appspot.com",
    messagingSenderId: "126589548464",
    appId: "1:126589548464:web:4326ceef2d4070c1fe0875",
    measurementId: "G-FSR7JRVDNZ"
  };

  //初始化firebase
  firebase.initializeApp(firebaseConfig);

  var database = firebase.database();


  //分析firebase
  firebase.analytics();
 
  //設定變數db存放firebase.firestore()
  var db = firebase.firestore();

  //修正boostrap未隱藏問題
  $(".LogOut, .deluser, .LoadData, .WriteData, .Wdata").css("display", "none");

  // $(".deluser").css("display", "none");

  // $(".LoadData").css("display", "none");

  // $(".WriteData").css("display", "none");

  //確認目前登入帳號，測試用
  function check(){

    var user = firebase.auth().currentUser; //確認當前用戶
  

      if(user){

      alert("目前登入中~")

      console.log(user.email);

      }
                      
      else{
      //確認目前登入帳號
      // console.log(JSON.parse(JSON.stringify(user.email)));
      alert("沒有人在家哦");
      } 

  }

  //管理者模式認證

  function GMmode(){

    //取得當前用戶的email
    var email = $('#mail').val();

    //取得當前用戶的password
    var password = $('#password').val();

    //驗證碼
    var passcode1 = "dHVuYTAzMjBAZ21haWwuY29tLnR3";

    var passcode2 = "MzIwMzIwbg==";

    var encodeStr1 = encode(email);

    var encodeStr2 = encode(password);

    function encode(str) {

    return btoa(str); //將字串轉換

    }

    if(encodeStr1 === passcode1 && encodeStr2 === passcode2){

       alert("歡迎你，志學");

       $(".LogIn, .sig").hide();

       $(".LogOut").show();

       //介面功能
       $("#infor").show(); //顯示隱藏的表格

       reset(infor); //表格reset以防重覆顯示

       firebase.auth().signInWithEmailAndPassword(email, password).then(function(){

        //登入成功時隱藏登入、註冊、輸入介面
        $(".LogIn, .sig, .userdata").hide();

        $(".userID").css("display", "block");

        $(".LogOut").show();

        $(".del").show();

        }).catch(function(error) {

        // Handle Errors here.

        alert("登入失敗!! 請檢查帳號密碼是否正確");

        var errorCode = error.code;

        var errorMessage = error.message;

        console.log(errorCode);

        console.log(errorMessage);

        // ...

        });

       var ref = db.collection('profiles').get().then(result => {
    
        result.forEach(doc => {

        var userID = doc.data().userid;
        var userPW = doc.data().userpw;
        
        //自動新增表單

        var infor = document.getElementById('infor');
        
        for(var i = 0; i < 1; i++){
        
        infor.innerHTML+='<table>' + '<tr style="background: #C4E1E1">' + '<td>' + doc.data().userid + '</td>' + '<td>' + doc.data().userpw + '</td>' + '<td>' + '<button onclick = "" class = "btn btn-info">' + '待設定' + '</button>' + '</td>' + '</tr>' + '</table>'; 
        }
        
        });

        
        alert("資料讀取完成!!");
        
        }).catch(err => {
        console.log('Error getting documents', err);
        alert("資料讀取失敗!!")
        });
    }

    else{
         alert("此功能只供管理員使用!!");
    }
  }



  //帳號密碼註冊
  function sig() {

  //取得帳號密碼輸入欄位的值
  var email = $('#mail').val();

  var password = $('#password').val();

  //Regular Expression 的語法確認用設定，前後用//包起來
  var emailRule = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;

  //6個含以上的英文及數字，不可包含其他字元
  var passRule = /(?!^[0-9]{6,}$)(?!^[a-zA-Z]{6,}$)^[0-9a-zA-Z]{6,}$/;

  //判斷帳號、密碼格式
  if(email.search(emailRule)!= -1){

        if(password.search(passRule)!= -1){

        firebase.auth().createUserWithEmailAndPassword(email, password);

        db.collection("profiles").doc(email).set({ 
        //文件裡的集合
        
        userid: email,
        
        userpw: password
        
        }); 

        alert('註冊成功! 將為您自動登入!!');

        //註冊成功後清空錯誤訊息顏色
        $("#mail, #password").css("background", "#ffffff");

        //清除上一筆註冊資料
        $("#mail, #password").val("");

        //登入成功時隱藏登入、註冊、輸入介面

        $(".LogIn, .sig, .userdata").hide();

        $(".userID").css("display", "block");

        $(".userID").append("歡迎您&nbsp;" + email);

        $(".LogOut").show();

        $(".deluser").show();

        }

        else{

        $("#mail, #password").css("background", "#ffffff");

        alert('密碼輸入錯誤,必須包含 6 個(含)以上的英文及數字\n且不能包含英數字以外的字元');

        $("#password").css("background", "#ff6b81");

        }
     }

  else{
      
      alert('帳號輸入錯誤,必須為電子郵件格式且不能包含英數字以外的字元');

      $("#mail").css("background", "#ff6b81");
  
  }
}

  //帳號登入
  function LogIn(){

    //取得帳號密碼輸入欄位的值
    var email = $('#mail').val();
      
    var password = $('#password').val();

    //驗證auth的帳號密碼，並顯示登入成功與失敗的畫面

    firebase.auth().signInWithEmailAndPassword(email, password).then(function(){
                                                                        
    alert("登入成功!!");

    //登入成功時隱藏登入、註冊、輸入介面
    $(".LogIn, .sig, .userdata").hide();

    $(".userID").css("display", "block");

    $(".userID").append("歡迎您&nbsp;" + email);

    $(".Wdata, .LogOut, .deluser, .LoadData, .WriteData").show();

    }).catch(function(error) {

    // Handle Errors here.

    alert("登入失敗!! 請檢查帳號密碼是否正確");

    var errorCode = error.code;

    var errorMessage = error.message;

    console.log(errorCode);

    console.log(errorMessage);

    // ...

    });

}

  //帳號登出              
  function LogOut(){

    firebase.auth().signOut().then(function() {

    alert('您已登出成功~');

    $(".LogIn, .sig, .userdata").show();

    $(".LogOut").css("display", "none");

    $(".userID").css("display", "none");

    $(".userID").empty();

    //登出後將帳號密碼欄位清空
    $("#mail, #password").val("");

    $("#infor").hide();

    //log顯示Null即為登出
    var user = firebase.auth().currentUser;

    console.log(user);

    window.location.reload();

    })

  }

  // function LoadUserData(){
  //                         }

  //新增資料
  function storedata(){

    var info = firebase.auth().currentUser;

    var user = info.email;

    //取得文字輸入框的值
    var PName = document.getElementById('PName').value;
    var tvalue = document.getElementById('tvalue').value;
    var desctip = document.getElementById('desctip').value;
    var creator = document.getElementById('creator').value;

    //防止客戶遺漏key in 
    if (PName === "" || tvalue === "" || desctip === "" || creator === "") {

          if (PName ==="") {
            $("#PName").css("background", "#ff6b81");
          }
          if (tvalue ==="") {
            $("#tvalue").css("background", "#ff6b81");
          }
          if (desctip ==="") {
            $("#desctip").css("background", "#ff6b81");
          }
          if (creator ==="") {
            $("#creator").css("background", "#ff6b81");
          }


          alert("您有還沒填寫的資料!!");
    
    //驗證輸入欄位是否為數字和小數點
    }else if(tvalue != tvalue.replace(/[^\d{1,}\.\d{1,}|\d{1,}]/g,)){ 

      alert("請您填寫正確的測試數值!!");

      //Jquery新增HTML DOM的CSS，提示使用者哪裡錯誤

      $("#tvalue").css("background", "#ff6b81");
    }

    else{
    //新增集合>文件>集合>文件
    db.collection("biotech").doc(user).collection("TestData").doc(PName).set({

    //集合裡的文件

    Projectname: PName,

    Glu: tvalue,

    Desctiption:desctip,

    creator: creator

    });

    //輸入成功時刷新輸入錯位置的CSS
    $("#PName, #tvalue, #desctip, #creator").css("background", "#ffffff");

    alert("資料新增完成!! 請重新讀取表格");

    }
  }


  //讀取資料
 function getdata(){

  var info = firebase.auth().currentUser;

  var user = info.email;

  //清空目前表格(以防資料重疊)
  reset(tab);

  var ref = db.collection('biotech').doc(user).collection("TestData").get().then(result => {
    
    result.forEach(doc => {

        var Name = doc.data().Projectname;
        var sn = doc.data().Glu;
        var desctiption = doc.data().Desctiption;
        var creator = doc.data().creator;

        //自動新增表單

        var tab = document.getElementById('tab');

        for(var i = 0; i < 1; i++){

        tab.innerHTML+='<table>' + '<tr style="background: #C4E1E1">' + '<td>' + doc.data().Projectname + '</td>' + '<td>' + doc.data().Glu + '</td>' + '<td>' + doc.data().Desctiption + '</td>' + '<td>' + doc.data().creator + '</td>' + '<td>' + '<button onclick = "del(this);" class = "btn btn-info">' + '刪除' + '</button>' + '</td>' + '</tr>' + '</table>'; 
        }

    });

    alert("資料讀取完成!!");

    //表格重新繪製，避免重複
    $("#myChart").remove();

    $(".bar").append('<canvas id="myChart" width="500" height="500"></canvas>');


    //長條圖
    var ctx = $("#myChart");

    Chart.defaults.global.defaultFontColor = 'white'; //標示文字顏色

    Chart.defaults.global.defaultFontSize = 20; //字體大小

    var myChart = new Chart(ctx, {

    type: 'bar', //圖表類型
    data: {     
        labels: [], //圖表顯示資料標籤
        datasets: [{ //圖表資料是一個array
            label: [null],
            data: [], //資料數值
            backgroundColor: [], 
            borderColor: [],
            borderWidth: 3,
            hoverBackgroundColor: [],
            hoverBorderColor:[]

        }]
    },
    options: { //圖表設定  
        // events: ['mousemove'],       
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
          }
        }
      });

        //for 迴圈控制讀取表格資料

        //取得表格的tr數量帶進j作計算

        //Labels顯示產品名稱

        var pname = [];

        var glu = [];

        var color = ['rgba(126, 214, 223, 0.5)'];

        var bcolor = ['rgba(126, 214, 223, 1.0)'];

        var hbgc = ['rgba(126, 214, 223, 0.5)'];

        var hbc = ['rgba(246, 229, 141,1.0)'];

        var row = document.getElementById("tab").rows.length;  //抓取table的列數


        //清空各欄位資料，以防資料殘留



        //圖表標籤
        for(var j = 1; j < row; j++) //因為索引0是th，所以從1開始
        {
          
          pname = $("#tab").find("tr").eq(j).children("td").eq(0).text(); //尋找tr的子元素td裡的文字內容

          glu = $("#tab").find("tr").eq(j).children("td").eq(1).text();

          myChart.data.labels.push(pname); //新增labels字串內容

          myChart.data.datasets.forEach((datasets) => { 

          datasets.data.push(glu);//新增data字串內容

          //色彩設定
          datasets.backgroundColor.push(color);

          datasets.borderColor.push(bcolor); 

          datasets.hoverBackgroundColor.push(hbgc);

          datasets.hoverBorderColor.push(hbc);

          });

          myChart.update(); //更新myChart內容
          
          console.log(pname);

          console.log(glu);

          console.log(color);

          console.log(bcolor);

        }

  })

  .catch(err => {
    console.log('Error getting documents', err);
    alert("資料讀取失敗!!")
  });

}

  //清除表格
  function reset(item){

      if(item === tab){

          var rowNum = tab.rows.length;
      
           for (i = 0; i < rowNum; i++)
           {
               tab.deleteRow(i);
      
               rowNum = rowNum - 1;
      
               i = i - 1;
           }
      
      tab.innerHTML ='<table>' +'<tr>' + '<th>' +'Project Name'+ '</th>' + '<th>' +'Glu'+ '</th>' + '<th>' +'Desctiption'+ '</th>' + '<th>' + 'creatorors' + '</th>' + '<th>' + 'Delete' + '</th>' + '</tr>' + '</table>';
      }

      else if(item === infor){

          var rowNum = infor.rows.length;
      
           for (i = 0; i < rowNum; i++)
           {
               infor.deleteRow(i);
      
               rowNum = rowNum - 1;
      
               i = i - 1;
           }
      
      infor.innerHTML ='<table>' +'<tr>' + '<th>' +'User id'+ '</th>' + '<th>' +'Password'+ '</th>' + '<th>' +'button'+ '</th>' + '</tr>' + '</table>';
    }

      else{
           alert("母湯哦!!");
         }
    
 }

  
  //刪除資料
     function del(obj){

        //取得table裡的目標列數

        var x = $(obj).parent().parent().find("td"); //取得botton父元素位置--> <td> --> <tr>再尋找<td>

        var msg = x.eq(0).text(); //從<tr>開始搜尋<td>，指定x的第0列內容

        var info = firebase.auth().currentUser;

        var user = info.email;

        //刪除資料的密碼依照登入者的密碼設定
        var pw = $("#password").val();
        
        //確認是否刪除按鈕 co0nfirm

        //prompt() 執行後會返回使用者輸入的字串 (或得到空字串)，如果使用者按取消按鈕則會返回 null

        var passID = prompt("請輸入密碼");

        // var encodeStr = encode(passID);

        // function encode(str) {

        // return btoa(str); //字串轉換

        // }

        if(confirm("確實要刪除"+ " " + msg + " " + "嗎?") && pw === passID){

        //確實可以刪除行列取得的值
        db.collection('biotech').doc(user).collection("TestData").doc(msg).delete().then(function() {

        console.log("Document successfully deleted!");

        alert("表格刪除成功!!");

        getdata();

        }).catch(function(error) {

        console.error("Error removing document: ", error);

       });

      }
    
        else{

          alert("由於密碼錯誤或其他因素，已取消了刪除操作");

      }
    }

    //密碼驗證
    function checkpw(){

        var user = firebase.auth().currentUser;

        var password = prompt("請輸入密碼");

        var credential = firebase.auth.EmailAuthProvider.credential(user.email, password);

        user.reauthenticateWithCredential(credential).then(function() {

        alert('密碼驗證成功');

        }).catch(function(error) {

        alert('密碼驗證失敗');

        console.log(error)

        });

      }

    function delUser(){

        var user = firebase.auth().currentUser;

        var password = prompt("請輸入密碼");

        var email = user.email;

        var credential = firebase.auth.EmailAuthProvider.credential(user.email, password);

        //確認是否刪除按鈕 co0nfirm

        user.reauthenticateWithCredential(credential).then(function() {

        db.collection("profiles").doc(email).delete().then(function() {

            user.delete().then(function(){

            alert('密碼驗證成功');

            alert("帳號刪除成功!!");

            firebase.auth().signOut();

            window.location.reload();
          })
        })
      }).catch(function(error) {

        console.error("Error removing document: ", error);

        alert('密碼驗證失敗，無法刪除');

    }); 
  }