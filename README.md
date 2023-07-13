# webapps-btu-assignment7

## BUSINESS DESCRIPTION ##

**Business Name: AdventureShop**

### Overview:
AdventureShop is a small company specializing in the sale and distribution of high-quality outdoor adventure gear and equipment. With a passion for outdoor activities and a deep understanding of the needs of outdoor enthusiasts, we have been serving customers for over a decade. Our goal is to provide our customers with the best equipment and gear, ensuring they have memorable and safe outdoor experiences.

Organization Description:
AdventureShop is located in Bonn, Germany, nestled in the heart of a region known for its stunning natural landscapes and adventurous spirit. As a small business, we value personalized customer service and take pride in curating a wide range of products from leading brands in the industry. Our knowledgeable staff members are avid outdoor enthusiasts themselves, enabling them to provide expert advice and guidance to our customers.

### Business Activities:

Product Sales: We offer a diverse range of outdoor adventure gear, including camping equipment, hiking gear, climbing gear, water sports gear, and apparel. Our inventory comprises top-quality products that cater to the varying needs and preferences of outdoor enthusiasts, from casual adventurers to seasoned professionals.

Customer Support: We understand that purchasing outdoor equipment can be overwhelming for some customers. Therefore, we prioritize providing excellent customer support throughout the entire buying process. Our staff members are readily available to offer product recommendations, answer queries, and assist customers in making informed decisions based on their specific requirements.

Outdoor Workshops and Events: In addition to selling outdoor gear, we organize workshops and events to promote outdoor activities and provide educational opportunities. These workshops cover various topics such as hiking and camping skills, equipment maintenance, and safety guidelines. By fostering a sense of community, we aim to inspire and empower individuals to explore the outdoors confidently.

## APPLICATION INFORMATION ##

**App Title**: AdventureShop

*Domain Name: adventureshop.com*

### Purpose of the App:
The AdventureShop Pro app aims to revolutionize the way outdoor enthusiasts explore and engage with our products and services. It serves as a comprehensive platform that enhances the overall customer experience by providing easy access to our product catalog, customer support and event registrations. The app combines convenience, information, and community engagement to support our customers' outdoor adventures and foster long-lasting relationships.

### App Requirements:
To enhance our business operations and improve the overall customer experience, we require a new app that fulfills the following requirements:

Product Catalog and Inventory Management: The app should showcase our product catalog, including descriptions, pricing, and availability. It should enable customers to browse through the catalog and access comprehensive product information. Additionally, the app should integrate with our inventory management system to ensure real-time updates on stock availability. When customers purchase a product, the availability should change accordingly.

Customer Support and Communication: The app should include a customer support feature that allows users to contact our team directly for any queries or assistance. It should store a database of customer ids, purchased products and contact phone numbers for quick and efficient communication.

Event and Workshop Registration: To streamline our event organization process, the app should enable customers to register for workshops and events directly. It should save event details, dates, and have the option for customers to register for the event. 

### Domain Model
![Domain information model](domain%20model.png)

### Design Model
![Design information model](design%20model.jpg)


## **INFORMATION MANAGEMENT TASKS** ##

| Original | Refined |
| --------------------------------------------------------------------------------------------------------------------------------------- | ---- |
| Enter New Product Data: Add a new product to the product catalog by entering its ID, name, description, price, and availability status. | Enter New Product Data: Add a new product to the product catalog by entering its name, description, price, and availability status. a unique id should be generated (starting from 1 and being incremented by 1 for each new product |
| Update Product Data: Allow updating of all product data items except the product ID, including the name, description, price, and availability status. | Update Product Data: Allow updating of all product data items except the product ID, including the name, description, price, and availability status.2 |
| View Product Catalog: Display a list of all products in the catalog, showing each product's ID, name, description, price, and availability status. | View Product Catalog: Display a list of all products in the catalog, showing each product's ID, name, description, price, and availability status. |
| Enter New Customer Data: Register a new customer by entering their ID, name, phone number. | Enter New Customer Data: Register a new customer by entering their name (single string), phone number.  A unique id should be generated (starting from 1 and being incremented by 1 for each new customer |
| Update Customer Data: Allow updating of all customer data items except the customer ID, including the name, phone number. | Update Customer Data: Allow updating of all customer data items except the customer ID, including the name, phone number. |
| View Customer Details: Display the details of a customer, including their ID, name, phone number, and the list of purchased products. | View Customer Details: Display the details of a customer, including their ID, name, phone number, and the list of purchased products. |
| Enter New Event Data: Add a new event or workshop by entering title, description, date, and an empty list of registered users. The event ID is automatically generated. | Enter New Event Data: Add a new event or workshop by entering title, description, date, and an empty list of registered customers.  A unique id should be generated (starting from 1 and being incremented by 1 for each new event |
| Update Event Data: Allow updating of all event data items except the event ID, including the title, description, date, and the list of registered users. | Update Event Data: Allow updating of all event data items except the event ID, including the title, description, date, and the list of registered customers. |
| View Event Details: Display the details of an event, including its ID, title, description, date, and the list of registered users. | View Event Details: Display the details of an event, including its ID, title, description, date, and the list of registered users.
| Product Purchase: Register a product purchase by a customer, updating the product's availability status and adding the product to the customer's list of purchased products. | Product Purchase: Register a product purchase by a customer, updating the product's availability status and adding the product to the customer's list of purchased products.
| Customer Registration for Event: Register a customer for an event, updating the event's list of registered users. | Customer Registration for Event: Register a customer for an event, updating the event's list of registered customers. 
| Check Product Availability: Allow users to check the availability status of a product by entering its ID, (or name?). Display the product's name, description, price, and availability status. | Check Product Availability: Allow users to check the availability status of a product by entering its ID, (or name?). Display the product's name, description, price, and availability status. |
| Search a Product: Allow users to search a product by its name or ID. | Search a Product: Allow users to search a product by its name or ID. |
| Search a Customer: Allow users to search a customer by their name or ID. | Search a Customer: Allow users to search a customer by their name or ID. |
| Search an Event: Allow users to search an event by its title or ID. | Search an Event: Allow users to search an event by its title or ID. |
| List All Events for a Customer: Display a list of all events a particular customer is registered for. Display the event ID, title, description date. | List All Events for a Customer: Display a list of all events a particular customer is registered for. Display the event ID, title, description date.
| List All Customers for an Event: Display a list of all customers registered for a particular event. Display the customer ID, name, phone number. | List All Customers for an Event: Display a list of all customers registered for a particular event. Display the customer ID, name, phone number. |
| List All Purchased Products for a Customer: Display a list of all products purchased by a particular customer. Display the product ID, name, description, price. | List All Purchased Products for a Customer: Display a list of all products purchased by a particular customer. Display the product ID, name, description, price. |


## tasks for 7C-1

create and retrieve: Ronny Porsch

delete and update: Benito Staedel

## tasks for 7C-2

authentication, authorization: Ronny Porsch

Enabling/disabling UI elements based on authentication: Benito Staedel

## tasks for 7C-3
1 Implement data validation: Ronny Porsch

2 Implement DB-UI synchronization, Test Data from JSON file: Benito Staedel

