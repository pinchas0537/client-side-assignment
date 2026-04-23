# :globe_with_meridians: Midterm-Client-side Assignment

Welcome to the Midterm Client-side Assignment! This assignment will test your knowledge of React (including useQuery,Redux, and React Router), as well as your ability to work with a REST API.

This will be the first time you integrate a **React application** with a **REST API** that you have built yourself (the very same API you built for the Midterm Server-side Assignment).

To refresh your memory, here are the specifications of the store you built for the Midterm Server-side Assignment:

## :minidisc: Information


- **Items:**
  - name
  - price
  - stock
  - category
  - supplier
  - image
  - description
- **Suppliers:**
  - name
  - items and their price
- **Orders:**
  - items and their quantity
  - address
  - order date
  - shop profit

## :hammer_and_wrench: Rules

- Inventory Management:

  - Each item price must be at least 30% higher than the supplier price. Our store cannot operate at a loss.
  - The stock should be automatically updated based on the orders.
  - If Item is out of stock, return an appropriate status code.

- Order Constraints:

  - Item quantity in a new order must be less than or equal to the stock in order to proceed.
  - Every order can have a maximum of 10 unique items.
  - A customer can order a maximum of 50 items in total.

- Collections Reliability:
  - If a supplier gets deleted. All the supplier items should be deleted automatically from the store items.
  - If a supplier item gets deleted. All the store items should be deleted automatically.
  - If a supplier item price changes. All the store items should be updated automatically. (The price difference should be at least 30%)
  - When supplier name changes, all the store items should be updated automatically.

- Revenue Analysis (on demand):

  - Get the monthly revenue of the store. (last 30 days)
  - Get the weekly most profitable category. (last 7 days)
  - Get the daily most profitable item. (last 24 hours)
  - Find the items with the highest and lowest profit margin. (all time)
  - Get the supplier whose items brought the most profit. (all time)
  - Get the amount of money spent for each supplier including both orders and items currently in store, sorted from highest to lowest. (all time)

## :desktop_computer: UI Pages

### :house: Home

The home page will be the main page of your application. It will display a list of all the **products** in your store. Each product will have a link to its own **details** page, as well as an *add to cart* button (with a quantity input).

The user should be able to filter the products by **category, supplier and price range**. Also, it should be possible to sort the products by **price** (ascending and descending) and **name** (ascending and descending).

At the top of the page, add a **search bar** that will allow the user to search for products by name. The search should be **case insensitive** and should match **partial words**.

Add a button to navigate to the **cart** page.

### :information_source: Details

The details page will display all the **information** about a product. It will also have a button to **add** the product to the cart (with a quantity input).

### :shopping_cart: Cart

Display a list of products added to the cart.

Add buttons to **remove** products from the cart and **clear the cart**. Add ➕ and ➖ buttons to increase and decrease the number of instances of a product in the cart. Display the **total price** of all products in the cart.

Add **recommendations** of products to add to the cart. You can make these recommendations random (based on the category of the products in the cart), based on popularity, or gain some bonus points and use a more sophisticated algorithm (e.g., based on other users' purchases).

### :gear: Admin

Display a list of all the products in the store. Add buttons to **edit**, **delete** and **add** new products.

The page should also display a list of suppliers. Add buttons to **delete** suppliers and **add** new ones.

:chart_with_upwards_trend: Add analytics section to the page:

- :package: **Total number of products** in the store

- :shopping: Products that are **about to run out of stock** (less than 5 instances left)

- :dollar: **Monthly revenue** of the store (last 30 days)

- :moneybag: **Weekly most profitable category** (last 7 days)

- :trophy: **Daily most profitable item** (last 24 hours)

- :bar_chart: **Items with the highest and lowest profit margin** (all time)

- :star2: **Supplier whose items brought the most profit** (all time)

- :heavy_dollar_sign: **Amount of money spent for each supplier** (all time)

## :pushpin: Standards

- Keep in mind the [Shop Rules](#hammer_and_wrench-rules) when implementing your application.
- Validate all user input.
- Display appropriate success/error messages to the user (A nice library for this is [react-toastify](https://www.npmjs.com/package/react-toastify)).
- Make sure your application is responsive.
- Make sure you are using **typescript** correctly:
  - No `any` type.
  - No `ts-ignore`.
  - Use `interfaces` for your collections.
  - Set the correct type for every variable, parameter, and return value.
  - Use utility types when applicable.
- Use **React Router** to navigate between pages.
- Use **Redux** to manage the state of your application.
- Use **useQuery** to fetch data from the server.
- Use **Functional components** and **Hooks**.
- You can use **Material UI** or other UI libraries to style your application.
- Make sure to break your application into components
- A component should only be responsible for one thing
- If you component's TSX code is larger than your screen, it is probably doing too much, break it into smaller components

## :page_with_curl: Instructions

1. Initialize a new vite project with `npm create vite midterm-client-side --template react-ts`
2. Start by implementing the basic Routing and Redux setup.
3. Create the UI pages and components, and display dummy data (Create the dummy data in the client-side code).
4. Connect the UI to the server using useQuery and display the real data.
5. Test your application and make sure it works as expected. Fix any bugs you find.
