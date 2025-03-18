# Breakable-Toy-I-Inventory-manager
# Description

This project is part of the spark program assignments, the objective is to develop a functional store manager, with CRUD functionalities,
ths project will be developed with the next technologies:

**Front-End**
- [ReactJS](https://react.dev/) *18.2.0*
    - Typescript *^5.3.3*
- [Jest](https://jestjs.io/) *^29.7.0*
- [Vite](https://vite.dev/guide/) *^6.2.2*
- [Vitest](https://vitest.dev/) *^3.0.9*
  
**With the help of the next dependies and libraries:**
- [TanstackTable](https://tanstack.com/) *^8.21.2*
- [React hooks]( https://react-hook-form.com/) *^7.54.2*
- [React modal](https://www.npmjs.com/package/react-modal) *^3.16.3*
- [Multiselect react dropdown](https://www.npmjs.com/package/multiselect-react-dropdown) *^2.0.25*
- [Tailwind](https://tailwindcss.com/) *^3.4.17*
- [FontAwesome](https://docs.fontawesome.com/) *^0.2.2*

# Installation

To the instalation of this project is necessary to have node instaled in a stable version, at the moment of the creation of this document the version used for this project is: ```v23.7.0```

You can download and install node **[here](https://nodejs.org/es)**.

> It's important to inform that the project is setted to work on PORT:9090, if for any reason this port is busy or you whish to change it you can find and modify this in the archive named **config.ts** in the project.

Once you have node installed you'll need to go your terminal of preference, locate in the desired directory to download the project,clone the repository and then execute the next commands:
```
git clone ${url of the repository}
//in case you haven't clone the project repository

npm install
```

Next to run the project is necessary to run the next command line:

```
npm run dev
```

**Functionalities**
- *Adding of products:*

    In the top section of the table of products, we can find a button with the legend add product, this will display a modal with a form ready to insert the
    information of the new product that the user want to add, all fields are required except for the expridation date. In case of a duplciated product the product
    will not be added.
- *Delete of products:*
  
    In the right side we can find a button with a trash can symbol, at the moment of click the product will be deleted from the storage and the product list will be
    updated.
- *Update of products:*
  
    On the left side of the delete button there's located another button with a pencil, this button will display a modal similar to the add product section, with the difference that the
    actual values of the product will be displayed, this to make easier the knowledge of the actual status of the product, same as the adding product functionality all the fields
    expect the expiration date are required.
- *Search of products:*
  
    In the top section of the system we find a search from that can be used to filter and search products by number (partial or complete match), the category with a
    multiselect of all the existing categories, and the status of the products, being out of stock, in stock, or both.
- *Set of out of stock state / default stock state:*
  
    In the left side of the products row we find a checkbox which at the moment of select it will set the stock status of the product to zero, if the same checkbox
    is unchecked it will set a default stock status that is 10.
- *Metrics*
  
    At the bottom of the system we can find a table which will show the metrics of all products separated by categories, this section display 3 sections of information:
    -  Total stock of the category
    -  Total value in stock of that category
    -  An average of unit price of all the products of that category

## Table behavior

In the product table it will change the appareance of the rows and cells depending of the product status according to the next rules:

***Background color for each row based on the expiration date:***
- No expiration date – No background color.
- Less than 1 week – Red background.
- 1-2 weeks – Yellow background.
- More than 2 weeks – Green background.

***Stock cell color:***
- Stock > 10 – No color
- Stock between 5 and 10 - Orange
- Stock < 5 - Red
- Out of stock products should have a strike-through text.



  
