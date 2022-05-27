# API restaurant application

Application for studies.
**API dosen't have english localization!**

The API allows you to manage personnel, product warehouse, tables, menus, orders and generate reports. The API also allows you to reserve tables.

Each endpoint, apart from creating a reservation, requires authorization, the created reservation request must be confirmed by an employee.
Authorization is controlled by the token after logging in.

The API is configured to support the NoSQL MongoDB database, after connecting to the database, the necessary records in the database for the application to work are completed.
To configure the connection with the database, create the "conifg.``` json" file in the directory.

```json
{
	"secret": "#",
	"connectionString": "mongodb + srv:// #: #@#.zbsku.mongodb.net/? retryWrites = true&w = majority"
}
```

\*Text was generate by automat from polish version of Readme.

---

## Data models

- Employee
  - Login
  - Password
  - Name
  - Last name
  - Position
- Dishes
  - Name
  - Price
  - Category
- Dish category
  - Name
- Orders
  - Employee responsible for the order
  - Denmark
  - Order status
  - Table
  - Price
- Status of the order
  - Name
- Positions
  - Name
  - Access level
- Product
  - Name
  - Price
  - Quantity
  - Unit
- Demand for products
  - Name
  - Quantity
  - Unit
- Reservation
  - Table
  - Customer's first and last name
  - Customer email
  - Start date
  - End date
  - Is confirmed
- Restaurant
  - Name
  - Address
  - Phone number
  - Tax ID
  - Email
  - Website
- Table
  - Table number
  - Number of seats
- Table status
  - Name
- Product unit
  - Name

# Endpoints

## Employees

---

### **Login**

`GET` employee/login

```json
{
	"Login": "",
	"Password": ""
}
```

> Login, returns a token (Bearer Token).

### **Registration**

`POST` employee/

```json
{
	"Login": "",
	"Password": "",
	"Name": "",
	"Surname": "",
	"Position": ""
}
```

> Register a new employee in the system.

### **Read employee**

`GET` employee/

> Reads the logged in employee by token.

### **Modification employee**

`PUT` employee/

```json
{
	"Login": "",
	"Password": "",
	"Name": "",
	"Surname": "",
	"Position": ""
}
```

> Modifies a logged in employee by token.

### **Removing employee**

`DELETE` employee/

> Deletes the logged in employee by token.

---

### **Employee list**

`GET` employee/list

> Returns a list of all employees, requires appropriate permissions.

### **Read employee by ID**

`GET` employee/:id

> Reads the logged in employee by ID, requires appropriate permissions.

### **Modification employee by ID**

`PUT` employee/:id

```json
{
	"Login": "",
	"Password": "",
	"Password": "",
	"Name": "",
	"Surname": ""
}
```

> Modifies a logged in employee by ID, requires appropriate permissions.

### **Removing employee by ID**

`DELETE` employee/:id

> Deletes a logged in employee by ID, requires appropriate permissions.

---

---

## Food categories

---

### **Category List**

`GET` mealcategory/list

> Optional parameters:
>
> > Sorting:
> >
> > - Ascending (asc),
> > - Descending (desc)
> >
> > Example: `mealcategory/list?sort=desc`

> Reads a list of food categories.

### **Read categories**

`GET` mealcategory/:id

> Reads out categories.

### **Adding categories**

`POST` mealcategory/

```json
{
	"Name": ""
}
```

> Adds categories.

### **Category modification**

`PUT` mealcategory/:id

```json
{
	"Name": ""
}
```

> Modifies categories.

### **Delete categories**

`DELETE` mealcategory/:id

> Deletes categories.

---

---

## Dishes

---

### **List dishes**

`GET` meal/list

> Optional parameters:
>
> > Sorting:
> >
> > - Ascending (asc),
> > - Descending (desc)
> >
> > Sorting parameters:
> >
> > - Meal category (category),
> > - Price (price),
> > - Default: Name (name)
> >
> > Dish category:
> >
> > - ID of the dish category
> >
> > Example: `meal/list?sort=desc&sortby=price&category=628e7156e8276180b1d04808`

> Reads a list of dishes.

### **Reading dish**

`GET` meal/:id

> Reads the dish.

### **Adding dish**

`POST` meal/

```json
{
	"Name": "",
	"Price": "",
	"MealCategory": ""
}
```

> Adds a dish.

### **Dish modification**

`PUT` meal/:id

```json
{
	"Name": "",
	"Price": "",
	"MealCategory": ""
}
```

> Modifies a dish.

### **Deleting dish**

`DELETE` meal/:id

> Deletes the dish.

---

---

## Orders

---

### **List orders**

`GET` order/list

> Optional parameters:
>
> > Sorting:
> >
> > - Ascending (asc),
> > - Descending (desc)
> >
> > Sorting parameters:
> >
> > - Surname of the employee (employee),
> > - Table number (number),
> > - Price (price),
> > - Default: Order status (orderstate)
> >
> > Example: `order/list?sort=desc&sortby=price`

> Reads order list. Appropriate permissions required.

### **Read order**

`GET` order/:id

> Reads the order. Appropriate permissions required.

### **Adding an order**

`POST` order/

```json
{
	"Employee": "",
	"Meal": "",
	"OrderState": "",
	"Table": "",
	"Price": ""
}
```

> Adde order. If the price is not given, it is calculated automatically on the basis of the given dishes from the menu. Appropriate permissions required.

### **Order modification**

`PUT` order/:id

```json
{
	"Employee": "",
	"Meal": "",
	"OrderState": "",
	"Table": "",
	"Price": ""
}
```

> Modifies an order. If the price is not given, it is calculated automatically on the basis of the given dishes from the menu. Appropriate permissions required.

### **Delete order**

`DELETE` order/:id

> Deletes the order. Appropriate permissions required.

---

---

## Order statuses

---

### **Status List**

`GET` orderstate/list

> Optional parameters:
>
> > Sorting:
> >
> > - Ascending (asc),
> > - Descending (desc)
> >
> > Example: `orderstate/list?sort=desc`

> Reads a list of available order statuses. Optionally sorted by name.

### **Read status**

`GET` orderstate/:id

> Reads the order status.

### **Adding Status**

`POST` orderstate/

```json
{
	"Name": ""
}
```

> Adds the order status. Appropriate permissions required.

### **Status modification**

`PUT` orderstate/:id

```json
{
	"Name": ""
}
```

> Modifies the status. Appropriate permissions required.

### **Delete status**

`DELETE` orderstate/:id

> Deletes the status. Appropriate permissions required.

---

---

## Employee positions

---

### **List of positions**

`GET` position/list

> Optional parameters:
>
> > Sorting:
> >
> > - Ascending (asc),
> > - Descending (desc)
> >
> > Example: `position/list?sort=desc`

> Reads the list of available employee positions. Optionally sorted by name.

### **Reading position**

`GET` position/:id

> Reads the position. Appropriate permissions required.

### **Read users by position**

`GET` position/employee:id

> Reads the list of users assigned to this seat by the seat ID. Appropriate permissions required.

### **Adding a position**

`POST` position/

```json
{
	"Name": "",
	"AccessLevel": ""
}
```

> Adds a position. Appropriate permissions required.

### **Position modification**

`PUT` position/:id

```json
{
	"Name": "",
	"AccessLevel": ""
}
```

> Modifies a position. Appropriate permissions required.

### **Removing a position**

`DELETE` position/:id

> Deletes a position. Appropriate permissions required.

---

---

## Products

---

### **List of products**

`GET` product/list

> Optional parameters:
>
> > Sorting:
> >
> > - Ascending (asc),
> > - Descending (desc)
> >
> > Sorting parameters:
> >
> > - Unit (unit),
> > - quantity (quantity),
> > - Price (price),
> > - Default: Product name (name)
> >
> > Pagination:
> >
> > - Page number
> >
> > Example: `product/list?sort=desc&sortby=price&page=2`

> Reads a list of available products.

### **Read product**

`GET` product/:id

> Reads products.

### **Adding a Product**

`POST` product/

```json
{
	"Name": "",
	"Price": "",
	"Quantity": "",
	"Unit": ""
}
```

> Adds a product. Appropriate permissions required.

### **Product modification**

`PUT` product/:id

```json
{
	"Name": "",
	"Price": "",
	"Quantity": "",
	"Unit": ""
}
```

> Modifies the product. Appropriate permissions required.

### **Product Removal**

`DELETE` product/:id

> Deletes the product. Appropriate permissions required.

---

---

## Product needs

---

### **List of requirements**

`GET` productneed/list

> Optional parameters:
>
> > Sorting:
> >
> > - Ascending (asc),
> > - Descending (desc)
> >
> > Sorting parameters:
> >
> > - Unit (unit),
> > - quantity (quantity),
> > - Default: Product name (name)
> >
> > Pagination:
> >
> > - Page number
> >
> > Example: `productneed/list?sort=desc&sortby=name&page = 2`

> Reads a list of available products. Display 5 products per page. Appropriate permissions required.

### **Read Requirement**

`GET` productneed/:id

> Reads the demand for products. Appropriate permissions required.

### **Adding Requirement**

`POST` productneed/

```json
{
	"Name": "",
	"Quantity": "",
	"Unit": ""
}
```

> Adds a demand for products. Appropriate permissions required.

### **Demand modification**

`PUT` productneed/:id

```json
{
	"Name": "",
	"Quantity": "",
	"Unit": ""
}
```

> Modifies the demand for products. Appropriate permissions required.

### **Delete requisition**

`DELETE` productneed/:id

> Removes the demand for products. Appropriate permissions required.

---

---

## Raports

---

### **Table layout report**

`GET` report/table/id=id

> Creates a table order report. It requires that the table ID or its number be given as a parameter. Appropriate permissions required.

### **Order report per waiter**

`GET` report/employee?Id=id

> Creates a report of orders handled by a given employee. requires that the employee's ID be specified as a parameter. Appropriate permissions required.

### **Report of orders in the indicated period of time**

`GET` report/date?Startdate=date&enddate=date

> Creates a report of placed orders in the given period of time. It requires a report start and end date, it supports the same dates and dates with time. Appropriate permissions required.

### **Revenue report for a specified period of time**

`GET` report/income?Startdate=date&enddate=date

> Creates a revenue report for a given period of time. It requires a report start and end date, it supports the same dates and dates with time. Appropriate permissions required.

---

---

## Reservations

---

### **Reservation list**

`GET` reservation/list

> Optional parameters:
>
> > Sorting:
> >
> > - Ascending (asc),
> > - Descending (desc)
> >
> > Sorting parameters:
> >
> > - Customer name and surname (clientname),
> > - Default: startdate
> >
> > Date:
> >
> > - Now (now),
> > - Today,
> > - Tomorrow (tomarrow),
> > - Any date, with a possible time
> >
> > Example: `reservation/list?sort=desc&sortby=clientname&date = June 1, 2022 08:00:00`

> Reads reservation list.

### **List of reservations by confirmation status**

`GET` reservation/ confirmed

> Optional parameters:
>
> > Is it confirmed ?:
> >
> > - Confirmed (true),
> > - Unconfirmed (false),
> >
> > Example: `reservation/confirmed? confirm=true`

> Reads the list of confirmed or not confirmed reservations. If the value is different, it returns reservations sorted from confirmed to unconfirmed.

### **Reading the reservation**

`GET` reservation/:id

> Reads reservations.

### **Adding a reservation**

`POST` reservation/

```json
{
	"TableId": "",
	"ClientName": "",
	"ClientEmail": "",
	"StartDate": "",
	"EndDate": "",
	"IsConfirmed": "" // false by default
}
```

> Adds reservations.

### **Modification of reservation**

`PUT` reservation/:id

```json
{
	"TableId": "",
	"ClientName": "",
	"ClientEmail": "",
	"StartDate": "",
	"EndDate": "",
	"IsConfirmed": "" // false by default
}
```

> Modifies reservations.

### **Delete reservation**

`DELETE` reservation/:id

> Deletes reservations.

---

---

## Restaurant

---

### **List of Restaurants**

`GET` restaurant/list

> Reads restaurant list.

### **Reading the restaurant**

`GET` restaurant/
`GET` restaurant/:id
`GET` restaurant/info
`GET` restaurant/about

> Reads the main restaurant or by the given ID.

### **Adding a restaurant**

`POST` restaurant/

```json
{
	"Name": "",
	"Address": "",
	"TelNumber": "",
	"NIP": "",
	"Email": "",
	"WWW": ""
}
```

> Adds restaurants. Requires appropriate permissions.

### **Restaurant modification**

`PUT` restaurant/:id

```json
{
	"Name": "",
	"Address": "",
	"TelNumber": "",
	"NIP": "",
	"Email": "",
	"WWW": ""
}
```

> Modifies restaurants. Requires appropriate permissions.

### **Removing restaurants**

`DELETE` restaurant/:id

> Deletes restaurants. Requires appropriate permissions.

---

---

## Tables

---

### **List of tables**

`GET` table/list

> Optional parameters:
>
> > Sorting:
> >
> > - Ascending (asc),
> > - Descending (desc)
> >
> > Sorting parameters:
> >
> > - Number of seats (seats),
> > - Default: Table number (number)
> >
> > Example: `table/list?sort=desc&sortby=number`

> Reads a list of tables.

### **List of tables with current status**

`GET` table/status

> Reads a list of tables with the current statuses.

### **List of tables available tables**

`GET` table/available

> Optional parameters:
>
> > Date:
> >
> > - Full date with time,
> > - On the given date
> >
> > Example: `table/available?date=May 26, 2022 10:24:00`

> Reads a list of available tables.

### **List of tables in occupied tables**

`GET` table/busy

> Optional parameters:
>
> > Date:
> >
> > - Full date with time,
> > - On the given date
> >
> > Example: `table/busy?date=May 26, 2022 10:24:00`

> Reads a list of occupied tables.

### **Reading table**

`GET` table/:id

> Reads the table.

### **Adding a table**

`POST` table/

```json
{
	"Name": "",
	"SeatsNumber": ""
}
```

> Adds a table.

### **Modification of the table**

`PUT` table/:id

```json
{
	"Name": "",
	"SeatsNumber": ""
}
```

> Modifies the table.

### **Removing a table**

`DELETE` table/:id

> Removes the table.

---

---

## Table statuses

---

### **Status List**

`GET` tablestate/list

> Optional parameters:
>
> > Sorting:
> >
> > - Ascending (asc),
> > - Descending (desc)
> >
> > Example: `tablestate/list?sort=desc`

> Reads a list of available order statuses. Optionally sorted by name.

### **Read status**

`GET` tablestate/:id

> Reads the order status.

### **Adding Status**

`POST` tablestate/

```json
{
	"Name": ""
}
```

> Adds a status. Appropriate permissions required.

### **Status modification**

`PUT` tablestate/:id

```json
{
	"Name": ""
}
```

> Modifies the status. Appropriate permissions required.

### **Delete status**

`DELETE` tablestate/:id

> Deletes the status. Appropriate permissions required.

---

---

## Units

---

### **List of units**

`GET` unit/list

> Optional parameters:
>
> > Sorting:
> >
> > - Ascending (asc),
> > - Descending (desc)
> >
> > Example: `unit/list?sort=desc`

> Reads a list of available units. Optionally sorted by name.

### **Read unit**

`GET` unit/:id

> Reads the entity.

### **Adding unit**

`POST` unit/

```json
{
	"Name": ""
}
```

> Adds a unit. Appropriate permissions required.

### **Modification of the unit**

`PUT` unit/:id

```json
{
	"Name": ""
}
```

> Modifies a unit. Appropriate permissions required.

### **Delete unit**

`DELETE` unit/:id

> Deletes a unit. Appropriate permissions required.
