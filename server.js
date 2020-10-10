const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const sanitizer = require('express-auto-sanitize');
const { check, validationResult } = require('express-validator');
app.use(bodyParser.urlencoded({ extended: true })); 
//app.use(bodyParser.json()); 
//app.use(bodyParser.raw());
const port = 3000;

//const swaggerJsdoc = require('swagger-jsdoc');
//const swaggerUi = require('swagger-ui-express');

//const options = {
//   swaggerDefinition: {
//      info: {
//         title: 'API',
//	 version: '1.0.0',
//	 description: 'API for 6177'
//      },
//      host: '161.35.55.4:3000',
//      basePath: '/',
//   },
//   apis: ['./server.js'],
//}
//const specs = swaggerJsdoc(options);
//app.use('/docs', swaggerUi.server, swaggerUi.setup(specs));

const mariadb = require('mariadb');
const pool = mariadb.createPool({
	host: 'localhost',
	user: 'root',
	password: 'root',
	database: 'sample',
	port: 3306,
	connectionLimit: 5
});

app.patch('/company/update2', [check('id').isNumeric], (req,res) => {
    const errors = validationResult(req)
    console.log(req.body)
    if (errors.isEmpty()){
      pool.getConnection()
        .then(conn => {
           conn.query("UPDATE company SET COMPANY_NAME = ?, COMPANY_CITY = ? WHERE COMPANY_ID = ?", [req.body.name, req.body.city, req.body.id])
             .then(() => {
              res.send("Success");
             })
            .catch(err => {
              //handle error
              console.log(err);
              conn.end();
            })
        }).catch(err => {
          //not connected
        });
    }
    else {res.send("ID must be a number")}
});

app.put('/company/update1', [check('id').isNumeric], (req,res) => {
     const errors = validationResult(req)
     console.log(req.body)
     if (errors.isEmpty()){
       const name = req.body.name
       const city = req.body.city
       const id = req.body.id
       pool.getConnection()
         .then(conn => {
            conn.query("UPDATE company SET COMPANY_NAME = ?, COMPANY_CITY = ? WHERE COMPANY_ID = ?", [req.body.name, req.body.city, req.body.id])
              .then(() => {
               res.send("Success");
              })
             .catch(err => {
               //handle error
               console.log(err);
               conn.end();
             })
         }).catch(err => {
           //not connected
         });
     }
     else {res.send("ID must be a number")} 
});

app.get('/company_names', (req,res) => {
  
  pool.getConnection()
     .then(conn => {
	conn.query("SELECT COMPANY_NAME FROM company")
	  .then((rows) => {
	   res.send(rows);
	  })
         .catch(err => {
           //handle error
           console.log(err);
           conn.end();
         })
     }).catch(err => {
       //not connected
     });
});

app.delete('/company/remove/:id', (req,res) => {
   if (isNaN(req.params.id)){res.send("ID must be a number")}
   else{
      app.use(sanitizer(req.params.id))
      pool.getConnection()
        .then(conn => {
           conn.query("DELETE FROM company WHERE COMPANY_ID=?", [req.params.id])
             .then(() => {
              res.send("Success");
             })
            .catch(err => {
              //handle error
              console.log(err);
              conn.end();
            })
        }).catch(err => {
          //not connected
        }); 
   }
});

app.get('/students_info',(req,res) => {
      pool.getConnection()
        .then(conn => {
	   conn.query("SELECT * FROM student")
           .then((rows) => {
               res.send(rows);	    
           })
          .catch(err => {
            //handle error
            console.log(err);
            conn.end();
          })
        }).catch(err => {
          res.send("here")
        });
});

app.get('/food_names', (req,res) => {
    pool.getConnection()
      .then(conn => {
         conn.query("SELECT ITEM_NAME FROM foods")
           .then((rows) => {
            res.send(rows);
           })
          .catch(err => {
            //handle error
            console.log(err);
            conn.end();
          })
      }).catch(err => {
        //not connected
      }); 
});

app.get('/customer_names', (req,res) => {

    pool.getConnection()
      .then(conn => {
         conn.query("SELECT CUST_NAME FROM customer")
           .then((rows) => {
            res.send(rows);
           })
          .catch(err => {
            //handle error
            console.log(err);
            conn.end();
          })
      }).catch(err => {
        //not connected
      });
});

app.post('/company/add', [check('id').isNumeric()], (req, res) => {
  //app.use(sanitizer(req.body.name))
  //app.use(sanitizer(req.body.city))
  const errors = validationResult(req)
  console.log(req.body)
  if (errors.isEmpty()){
     pool.getConnection()
       .then(conn => {
          conn.query("INSERT company VALUES (?,?,?)", [req.body.id, req.body.name, req.body.city])
            .then(() => {
             res.send("Success");
            })
           .catch(err => {
             //handle error
             console.log(err);
             conn.end();
           })
      }).catch(err => {
         //not connected
       });
   }
   else{res.send("ID must be a number")}
});

/** 
* @swagger 
* /company_names: 
*    get: 
*       description: Return all company names 
*       products: 
*           - application/json 
*       responces: 
*           200: 
*               description: Object company array of all company names 
* 
* /company/update1: 
*    put: 
*       description: Updates a companys name and city 
*       products: 
*           - application/json 
*       responces: 
*           200: 
*               description: Success 
* 
* /company/update2: 
*    patch: 
*       description: Updates a companys name and city 
*       products: 
*           - application/json 
*       responces: 
*           200: 
*               description: Success 
* 
* /company/delete/{id}: 
*    delete: 
*       description: Deletes a company 
*       products: 
*           - application/json 
*       responces: 
*           200: 
*               description: Success 
* 
* /students_info: 
*    get: 
*       description: Returns all attributes of all students 
*       products: 
*           - application/json 
*       responces: 
*           200: 
*               description: Object student array of all students 
* 
* /food_names: 
*    get: 
*       description: Returns all names of all foods 
*       products: 
*           - application/json 
*       responces: 
*           200: 
*               description: Object food array of all food names 
* 
* /customer_names: 
*    get: 
*       description: Returns all names of all customers 
*       products: 
*           - application/json 
*       responces: 
*           200: 
*               description: Object customer array of all customer names 
*
* /company/add: 
*    post: 
*       description: Adds a company 
*       products: 
*           - application/json 
*       responces: 
*           200: 
*               description: Success 
*/

app.listen(port, () => {
  console.log('Example app listening at http://localhost:${port}')
});
