drop database restaurant;
create database restaurant;
use restaurant;
CREATE TABLE IF NOT EXISTS contact_info
(
    contact_info_id VARCHAR(100),
    name VARCHAR (100) NOT NULL,
    address VARCHAR (150) NOT NULL,
    email VARCHAR(150) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    PRIMARY KEY(contact_info_id)
);
CREATE TABLE IF NOT EXISTS users(
    user_id VARCHAR(100),
    username VARCHAR(50),
    password VARCHAR(255),
    PRIMARY KEY(user_id),
    FOREIGN KEY (user_id) REFERENCES contact_info(contact_info_id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS food_category
(
    food_category_name VARCHAR(100),
    PRIMARY KEY(food_category_name)
);
CREATE TABLE IF NOT EXISTS food_item
(
    food_item_name VARCHAR(100),
    food_item_price double(10,2),
    food_category_name VARCHAR(100),
    PRIMARY KEY(food_item_name),
    FOREIGN KEY (food_category_name) REFERENCES food_category(food_category_name)
);
CREATE TABLE IF NOT EXISTS menu
(
    menu_name VARCHAR(100),
    menu_start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP UNIQUE,
    menu_end_date DATE,
    is_menu_active BOOLEAN DEFAULT 0,
    PRIMARY KEY(menu_name,menu_start_date)
);
CREATE TABLE IF NOT EXISTS menu_content
(
    menu_name VARCHAR(100),
    food_item_name VARCHAR(100),
    is_food_available BOOLEAN DEFAULT 1,
    FOREIGN KEY (menu_name) REFERENCES menu(menu_name),
    FOREIGN KEY (food_item_name) REFERENCES food_item(food_item_name)
);
CREATE TABLE IF NOT EXISTS customer(
    customer_id VARCHAR(100) PRIMARY KEY,
    FOREIGN KEY (customer_id) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS staff_category
(
    staff_category VARCHAR (100) PRIMARY KEY,
    salary double(10,2)
);
CREATE TABLE IF NOT EXISTS staff(
    staff_id VARCHAR(100) PRIMARY KEY,
    staff_category VARCHAR(100),
    last_paid_date TIMESTAMP,
    joined_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP UNIQUE,
    FOREIGN KEY (staff_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (staff_category) REFERENCES staff_category(staff_category) ON DELETE CASCADE);

CREATE TABLE IF NOT EXISTS import_company
(
    import_company_id VARCHAR(100) PRIMARY KEY,
    total_transactions double(10,2) DEFAULT 0.0,
    remain_transactions double(10,2) DEFAULT 0.0,
    FOREIGN KEY(import_company_id) REFERENCES contact_info(contact_info_id)
);

CREATE TABLE IF NOT EXISTS restaurant
(
    restaurant_id VARCHAR(100) PRIMARY KEY,
    total_staff INTEGER(10),
    capacity INTEGER(10),
    total_tables INTEGER(10),
    FOREIGN KEY(restaurant_id) REFERENCES contact_info(contact_info_id)  ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS restaurant_table(
    table_no INTEGER(10) PRIMARY KEY,
    is_empty BOOLEAN DEFAULT 1
);

CREATE TABLE IF NOT EXISTS import(
    import_company_id VARCHAR(100),
    bill_no INTEGER(10),
    total_price double(10,2),
    import_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP UNIQUE NOT NULL,
    PRIMARY KEY(bill_no),
    FOREIGN KEY(import_company_id) REFERENCES import_company(import_company_id)
);
CREATE TABLE IF NOT EXISTS import_type(
    import_type VARCHAR(120) PRIMARY KEY,
    measure_unit VARCHAR(10)
);

CREATE TABLE IF NOT EXISTS import_detail(
    import_good VARCHAR(200),
    import_type VARCHAR(120),
    bill_no INTEGER(10),
    quantity double(10,2),
    price double(10,2),
    FOREIGN KEY (bill_no) REFERENCES import(bill_no) ON DELETE CASCADE,
    FOREIGN KEY(import_type) REFERENCES import_type(import_type)
);
CREATE TABLE IF NOT EXISTS stock(
    stock_name VARCHAR(200) PRIMARY KEY,
	type_of_stock VARCHAR(120),
    last_import_date TIMESTAMP,
    quantity double(10,2),
    FOREIGN KEY (last_import_date) REFERENCES import(import_date),
    FOREIGN KEY(type_of_stock) REFERENCES import_type(import_type)
);
CREATE TABLE IF NOT EXISTS reservation
(
    customer_id VARCHAR(100),
    table_no INTEGER(10),
    number_of_person INTEGER(2),
    reservation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP UNIQUE,
    reservation_fulfilled_status BOOLEAN DEFAULT 0,
    reserved_for_date TIMESTAMP,
    reserved_for_time TIME,
    PRIMARY KEY (reservation_date),
    FOREIGN KEY (customer_id) REFERENCES customer(customer_id),
    FOREIGN KEY (table_no) REFERENCES restaurant_table(table_no)
);
CREATE TABLE IF NOT EXISTS food_order
(
    order_id VARCHAR(120),
    order_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP UNIQUE,
    is_order_complete BOOLEAN DEFAULT 0,
    PRIMARY KEY (order_id)
);

CREATE TABLE IF NOT EXISTS home_delivery(
    home_delivery_no VARCHAR(120),
    customer_id VARCHAR(120),
    delivery_staff_id VARCHAR(120),
    is_delivered BOOLEAN DEFAULT 0,
    PRIMARY KEY (home_delivery_no),
    FOREIGN KEY (customer_id) REFERENCES customer(customer_id),
    FOREIGN KEY (delivery_staff_id) REFERENCES staff(staff_id)
);

CREATE TABLE IF NOT EXISTS order_item(
    order_id VARCHAR(50),
    food_item_name VARCHAR(100),
    quantity INT(3) DEFAULT 1,
    FOREIGN KEY (order_id) REFERENCES food_order(order_id),
    FOREIGN KEY (food_item_name) REFERENCES food_item(food_item_name)
);
CREATE TABLE IF NOT EXISTS bill(
	bill_no VARCHAR(100) PRIMARY KEY,
	order_id VARCHAR(120),
	total_price double(15,5),
    issue_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP UNIQUE,
    FOREIGN KEY(order_id) REFERENCES food_order(order_id)
);
CREATE TABLE IF NOT EXISTS order_relates_staff(
    order_id VARCHAR(50),
    staff_id VARCHAR(120),
    FOREIGN KEY (order_id) REFERENCES food_order(order_id),
   FOREIGN KEY (staff_id) REFERENCES staff(staff_id)
);

CREATE TABLE IF NOT EXISTS order_relates_table(
    order_id VARCHAR(50),
    table_no INT (11),
    FOREIGN KEY (order_id) REFERENCES food_order(order_id),
    FOREIGN KEY(table_no) REFERENCES restaurant_table(table_no)
);
CREATE TABLE IF NOT EXISTS order_relates_home_delivery(
    order_id VARCHAR(50),
    home_delivery_no VARCHAR(120),
    FOREIGN KEY (order_id) REFERENCES food_order(order_id),
    FOREIGN KEY (home_delivery_no) REFERENCES home_delivery(home_delivery_no)
);