
exports.handler = async (event) => {
     // TODO implement
     var a = event.path;
     a = a.replace('/',' ');
     const response = {
         statusCode: 200,
         body: JSON.stringify('Hello' + a + '!'),
     };
     return response; 
};

