function(properties, context) {
var serviceAccount = {
   "type": "service_account",
   "project_id": "login-database-brc",
   "private_key_id": "8ffa13a076e81d76708159835f3a5a74ec110e2a",
   "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC/qHUjnzIxduv6\n5mi0Rg/sGcyuOgLXu5bTiuYTowxbz3MLV/EMBG6RWqMWlqg6pz9rdLyg7p0JaU4m\nmEBl3RU+XaCTIltG7eTadeOOR8HKaB7jgwLEaZQAQkMoTPqg5y1I3HzK9PT5vvlL\nG2tTSMQ15ZD6KjF/pvG/Mkildf9T2PQ66XWZ5pSFOvOMmuWurvv3UDRm2KgjlskH\nvkrKvlPkOUyK27ANyBJuMny+cwYG/EwvW2yAjVgw6W29poAh88/nWc/JaiUmpu7S\nq8wKi0p7a51I0A0nzYlPNDT5GPgPu0q+y+rfIBHDEO2T/q7zCLvmIr+NKppej2B2\nx+DvCZAZAgMBAAECggEABvsIwTJkLp8JO0s3FxHSNKQ/6zybq+XeOXg+pwpyQcnN\ng+VBF1H2AP9PH1x/Zht/WNeYozftqlEWkptLBSrHQk1Asvs2Xd/+TOKsVhtQ+KFQ\nNrMn36WEyXmgXpBnNIMXCCdXuECxx4LoK48lGpR06Q2ieSoeQWsANRmMwdIJabFW\nFqOxZOqO5JRjUm4BdKB4SHh0fXDloD5tdRNGTsrTdXh9s8+BgJndBZ9qOm+/g2gS\nVF/8ujYMUGEgcSXihvBzZ5otHK8+dUpyToNStyM5aB3m1qp9OVua6GISnFbDQa5N\n/9qenYJw997wYEC10MPgu3IjhT3PZ9QwZ1ca89e0XQKBgQDlcCKPnWKuWsoErVaG\nD1HmHM1wzRUYGtYC/bnW1qPgmTVo4Yr7LDYXOksw1HUGsVh9dhLCpyJZXSN/Offf\nzDfICjH43/5VP4X+ETbU3SzjV8oXB7VGp52BSomlbljPwcf+xR0eptJYPHuZBLit\n5yyBoCOzB8GQiYvzMR2soSxxDwKBgQDV2KKlJLz5q4mA2wyd+QfVTAG/263/qfC+\nzLNVKpIcmuuGicMbLxIuvJjqHsKx4puT53k8VAapoHYonPUfcTE3J4XtIIIatE20\ns43uAwMvHo6nVTtj9OQtxUj3UEK4nLeYGqYPc0iiAUjWGBy02Xyd3yjhC4qlDt0B\n3EsLV1acVwKBgQCIBSuoIrEvFonvree+wHRYTLkK57pauQYpbcxv7n3nGE1OqW/g\nqnxC1v9eqoXaeucwMgC7P6SggBQcR/yIxCRJxqmLlxfL6EYCsqfkGF+VRCV988bn\nZVV+IfdqiPnD6WksxCUYV+QaBXls5RyrlIKRMqQXbkC19KVwfqzN/BtBxwKBgQCN\nwqfHXDxeMmXb4tpRWsXjkxhRzFpjco+inGaBnc/wYI6jyG1rdt/R1bp08WFVtQg3\nmyoWYQltp27M64ffiRT8IBo7IOK+uyoMET+UObEBqnsc2Hafg7dD1FXThQRGB7X5\ngij1cxICO2HCc4eMJ+Thbw9VaGZHlzvRQO0KnqJOzwKBgG5IVabAUGVxYUtDNcuR\nI+MJK8qxfrL5CcPJOKm4o03gs7DfHe1Mwn2jLKcbiug46ZYRjJlBsRqaCtdVxS+U\n6e/sLmK3MPFWvMF6/JFUqotNCPE9FvXgnjif3tvR6/9YC/Uktn6plt9VkzvDkOe5\nqrl6x4gsw9KK3rWB4WxIsQDq\n-----END PRIVATE KEY-----\n",
   "client_email": "firebase-adminsdk-13f1y@login-database-brc.iam.gserviceaccount.com",
   "client_id": "113927598141448705139",
   "auth_uri": "https://accounts.google.com/o/oauth2/auth",
   "token_uri": "https://oauth2.googleapis.com/token",
   "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
   "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-13f1y%40login-database-brc.iam.gserviceaccount.com"
}


var admin = require("firebase-admin");


// Initialize the app with a service account, granting admin privileges
if (!admin.apps.length) {
   initializeApp(serviceAccount)
}

function initializeApp(serviceAccount) {
   admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: "https://login-database-brc.firebaseio.com"
   });
}


function getData() {
   var promise = admin.database().ref('BRC/4jV39aEK6jOecLdKONJMKatsEYn1/data').once("value");

   promise.then(snapshot => {
      let element = snapshot.val()
      let list = []
      for (var key in element) {
         list.push(element[key].Name)
      };
       list.push('this is returned')
      return list;
   })
      .catch(error => {
         return error
      });

   return promise;
}



var thepromise;

getData().then((list) => {
   var thepromise = list
	thepromise.push()
      
})

   return {"data":thepromise};

}
//the code specific to bubble is the 
//
//  function(properties, context) {}
//and 
//  return{"data":thepromise}
