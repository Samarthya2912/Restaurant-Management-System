create database kitchen;
use kitchen;

create table food_cat(
food_cat_id varchar(12) not null,
food_cat_name char(18),
primary key(food_cat_id)
);

create table food_item(
food_item_id varchar(10) not null,
name char(18),
price int(7),
food_category_id int(10),
primary key(food_item_id)
);

create table menu_content(
menu_id varchar(12) not null,
food_item_id char(20),
is_available char(5)
);

create table menu(
menu_id varchar(12) not null,
start_date date,
end_date date,
is_active char,
primary key(menu_id)
);

insert into food_cat(food_cat_id,food_cat_name) values(1,'Breakfast');
insert into food_cat(food_cat_id,food_cat_name) values(2,'Snacks');
insert into food_cat(food_cat_id,food_cat_name) values(3,'Soups/Salad');
insert into food_cat(food_cat_id,food_cat_name) values(4,'Beverages');
insert into food_cat(food_cat_id,food_cat_name) values(5,'Bar/Cocktail');
insert into food_cat(food_cat_id,food_cat_name) values(6,'Dinner');
insert into food_cat(food_cat_id,food_cat_name) values(7,'Dessert');


insert into food_item(food_item_id,name,price,food_category_id) values(1,'Milk',80,1 );
insert into food_item(food_item_id,name,price,food_category_id) values(2,'Americano',120,1);
insert into food_item(food_item_id,name,price,food_category_id) values(3,'Expresso',80,1 );
insert into food_item(food_item_id,name,price,food_category_id) values(4,'Coffee',100,1 );
insert into food_item(food_item_id,name,price,food_category_id) values(5,'Tea',70,1 );
insert into food_item(food_item_id,name,price,food_category_id) values(6,'Egg Toast',80,1);
insert into food_item(food_item_id,name,price,food_category_id) values(7,'Chicken Sandwich',150,1 );
insert into food_item(food_item_id,name,price,food_category_id) values(8,'Veg Sandwich',110,1 );
insert into food_item(food_item_id,name,price,food_category_id) values(9,'Butter Toast',100,1 );
insert into food_item(food_item_id,name,price,food_category_id) values(10,'PanCake',120,1 );
insert into food_item(food_item_id,name,price,food_category_id) values(11,'Breakfast Burrito',150,1 );
insert into food_item(food_item_id,name,price,food_category_id) values(12,'Oatmeal',250,1 );
insert into food_item(food_item_id,name,price,food_category_id) values(13,'Muffin',150,1 );
insert into food_item(food_item_id,name,price,food_category_id) values(14,'Donut',80,1 );
insert into food_item(food_item_id,name,price,food_category_id) values(15,'Toast',150,1 );
insert into food_item(food_item_id,name,price,food_category_id) values(16,'Omelete',80,1 );
insert into food_item(food_item_id,name,price,food_category_id) values(17,'Grilled fish',120,1 );
insert into food_item(food_item_id,name,price,food_category_id) values(18,'Bread and Jam',120,1 );
insert into food_item(food_item_id,name,price,food_category_id) values(19,'Side Hash Brown',120,1 );
insert into food_item(food_item_id,name,price,food_category_id) values(20,'Boiled Eggs',50,1 );

insert into food_item(food_item_id,name,price,food_category_id) values(21,'CheeseBalls',100,2 );
insert into food_item(food_item_id,name,price,food_category_id) values(22,'Veg Tempora',120,2 );
insert into food_item(food_item_id,name,price,food_category_id) values(23,'French Fries'130,2 );
insert into food_item(food_item_id,name,price,food_category_id) values(24,'Panner Tikka',250,2 );
insert into food_item(food_item_id,name,price,food_category_id) values(25,'Veg Pakoda',120,2 );
insert into food_item(food_item_id,name,price,food_category_id) values(26,'Panner Pakoda',210,2 );
insert into food_item(food_item_id,name,price,food_category_id) values(27,'Alu Chip'150,2, );
insert into food_item(food_item_id,name,price,food_category_id) values(28,'Mustang Alu',120,2 );
insert into food_item(food_item_id,name,price,food_category_id) values(29,'Veg Sizzler',200,2 );
insert into food_item(food_item_id,name,price,food_category_id) values(30,'Fish Fry',120,2 );
insert into food_item(food_item_id,name,price,food_category_id) values(31,'Chicken Fry',200,2 );
insert into food_item(food_item_id,name,price,food_category_id) values(32,'Chicken Momo',180,2 );
insert into food_item(food_item_id,name,price,food_category_id) values(33,'Veg Momo',150,2 );
insert into food_item(food_item_id,name,price,food_category_id) values(34,'C Momo',220,2 );
insert into food_item(food_item_id,name,price,food_category_id) values(35,'Jhol Momo',200,2 );
insert into food_item(food_item_id,name,price,food_category_id) values(35,'Chips',100,2 );
insert into food_item(food_item_id,name,price,food_category_id) values(36,'Cookie',120,2 );
insert into food_item(food_item_id,name,price,food_category_id) values(37,'Cake',100,2 );
insert into food_item(food_item_id,name,price,food_category_id) values(38,'Onion Rings',120,2 );
insert into food_item(food_item_id,name,price,food_category_id) values(39,'Fried Shrimp',150,2 );
insert into food_item(food_item_id,name,price,food_category_id) values(40,'Burger',130,2 );
insert into food_item(food_item_id,name,price,food_category_id) values(41,'Veg Pizza',220,2 );
insert into food_item(food_item_id,name,price,food_category_id) values(42,'Chicken Pizza',270,2 );
insert into food_item(food_item_id,name,price,food_category_id) values(43,'Mixed Pizza',150,2 );
insert into food_item(food_item_id,name,price,food_category_id) values(44,'Mushroom Pizza',230,2 );
insert into food_item(food_item_id,name,price,food_category_id) values(45,'Mozzarella Sticks',140,2 );
insert into food_item(food_item_id,name,price,food_category_id) values(46,'Hot Wings',210,2 );
insert into food_item(food_item_id,name,price,food_category_id) values(47,'Grilled Chicken',250,2 );
insert into food_item(food_item_id,name,price,food_category_id) values(48,'Roasted Chicken',270,2 );
insert into food_item(food_item_id,name,price,food_category_id) values(49,'Singapore Fish',170,2 );
insert into food_item(food_item_id,name,price,food_category_id) values(50,'Hot Dog',180,2 );


insert into food_item(food_item_id,name,price,food_category_id) values(51,'Tomato Soup',120,3 );
insert into food_item(food_item_id,name,price,food_category_id) values(52,'Won Ton Soup',250,3 );
insert into food_item(food_item_id,name,price,food_category_id) values(53,'Chicken Soup',200,3 );
insert into food_item(food_item_id,name,price,food_category_id) values(54,'Mushroom Soup',160,3 );
insert into food_item(food_item_id,name,price,food_category_id) values( 55,'Egg Droup Soup',220,3);
insert into food_item(food_item_id,name,price,food_category_id) values(56,'Chinese Soup',130,3 );
insert into food_item(food_item_id,name,price,food_category_id) values(57,'Vegetable Soup',100,3 );
insert into food_item(food_item_id,name,price,food_category_id) values(58,'Mixed Soup',150,3 );
insert into food_item(food_item_id,name,price,food_category_id) values(59,'Hot and Sour Soup',200,3 );
insert into food_item(food_item_id,name,price,food_category_id) values(60,'Bean Soup',120,3 );

insert into food_item(food_item_id,name,price,food_category_id) values(61,'CocaCola',60,4 );
insert into food_item(food_item_id,name,price,food_category_id) values(62,'Fanta',60,4  );
insert into food_item(food_item_id,name,price,food_category_id) values(63,'Slice',70,4  );
insert into food_item(food_item_id,name,price,food_category_id) values(64,'Orange Juice',40,4  );
insert into food_item(food_item_id,name,price,food_category_id) values( 65,'RedBull',90,4 );
insert into food_item(food_item_id,name,price,food_category_id) values(66,'Cold Coffee',160,4  );
insert into food_item(food_item_id,name,price,food_category_id) values(67,'Cold Coffee with icecream',250,4  );
insert into food_item(food_item_id,name,price,food_category_id) values( 68,'Lemon Soda',60,4 );
insert into food_item(food_item_id,name,price,food_category_id) values(69,'Mango lassi',90,4  );
insert into food_item(food_item_id,name,price,food_category_id) values(70,'Vanilla Lattee',120,4 );

insert into food_item(food_item_id,name,price,food_category_id) values(71,'Mojito',300,5 );
insert into food_item(food_item_id,name,price,food_category_id) values(72,'Tequila',290,5 );
insert into food_item(food_item_id,name,price,food_category_id) values(73,'Bloody Mary',390,5 );
insert into food_item(food_item_id,name,price,food_category_id) values(74,'Margarita',250,5 );
insert into food_item(food_item_id,name,price,food_category_id) values(75,'Cape codder',270,5 );
insert into food_item(food_item_id,name,price,food_category_id) values(76,'On Beach',240,5 );
insert into food_item(food_item_id,name,price,food_category_id) values(77,'Screwdriver',290,5 );
insert into food_item(food_item_id,name,price,food_category_id) values(78,'Chinese Salamander',190,5 );
insert into food_item(food_item_id,name,price,food_category_id) values( 79,'Orange creamsicle',390,5);
insert into food_item(food_item_id,name,price,food_category_id) values( 80,'Root Float',280,5);
insert into food_item(food_item_id,name,price,food_category_id) values(81,'Red Wine',210,5 );
insert into food_item(food_item_id,name,price,food_category_id) values(82,'Robert Mondavi Wine',280,5 );
insert into food_item(food_item_id,name,price,food_category_id) values( 83,'Brick House Wine',210,5);
insert into food_item(food_item_id,name,price,food_category_id) values( 84,'August cellars Wine',280,5);
insert into food_item(food_item_id,name,price,food_category_id) values( 85,'Red Fort Wine',350,5);
insert into food_item(food_item_id,name,price,food_category_id) values( 86,'Del rio Wine',220,5);
insert into food_item(food_item_id,name,price,food_category_id) values( 87,'Hopler Wine',280,5);
insert into food_item(food_item_id,name,price,food_category_id) values( 88,'Root Float',280,5);
insert into food_item(food_item_id,name,price,food_category_id) values(89,'Dog Point Wine',220,5 );
insert into food_item(food_item_id,name,price,food_category_id) values(90,'Belle Glos Wine',210,5 );
insert into food_item(food_item_id,name,price,food_category_id) values(91,'Red Label',400,5 );
insert into food_item(food_item_id,name,price,food_category_id) values(92,'Remy Martin',410,5 );
insert into food_item(food_item_id,name,price,food_category_id) values(93,'Mc Doweles',500,5 );
insert into food_item(food_item_id,name,price,food_category_id) values(94,'Nuns Island',550,5 );
insert into food_item(food_item_id,name,price,food_category_id) values( 95,'The Dalmore 57',700,5);
insert into food_item(food_item_id,name,price,food_category_id) values(96,'Coconut Brandy',800,5 );
insert into food_item(food_item_id,name,price,food_category_id) values(97,'Diva Vodka',1200,5 );
insert into food_item(food_item_id,name,price,food_category_id) values( 98,'Henri Dudognon',450,5);
insert into food_item(food_item_id,name,price,food_category_id) values( 99,'Platinum liquor',550,5);
insert into food_item(food_item_id,name,price,food_category_id) values( 100,'DaMLFI lIMONCELLO',350,5);

insert into food_item(food_item_id,name,price,food_category_id) values(101,'Steam Rice',200,6 );
insert into food_item(food_item_id,name,price,food_category_id) values(102,'Plain Fried Rice',220,6 );
insert into food_item(food_item_id,name,price,food_category_id) values(103,'Thakali Set',250,6 );
insert into food_item(food_item_id,name,price,food_category_id) values(104,'Mushroom Rice Set',240,6 );
insert into food_item(food_item_id,name,price,food_category_id) values( 105,'Chicken Rice Set',270,6);
insert into food_item(food_item_id,name,price,food_category_id) values( 106,'Fish Rice Set',230,6);
insert into food_item(food_item_id,name,price,food_category_id) values(107,'Roti',100,6 );
insert into food_item(food_item_id,name,price,food_category_id) values(108,'Paratha ',120,6 );
insert into food_item(food_item_id,name,price,food_category_id) values( 109,'Shrimp Rice Set',250,6);
insert into food_item(food_item_id,name,price,food_category_id) values(110,'Mixed Rice Set',220,6 );

insert into food_item(food_item_id,name,price,food_category_id) values(111,'Toffee and Honey Comb',250,7 );
insert into food_item(food_item_id,name,price,food_category_id) values(112,'Cheese Cake',120,7 );
insert into food_item(food_item_id,name,price,food_category_id) values(113,'Apple Pie',120,7 );
insert into food_item(food_item_id,name,price,food_category_id) values( 114,'Salted Caramel Mousse',240,7);
insert into food_item(food_item_id,name,price,food_category_id) values( 115,'Malster Ice Cream Sundae',120,7);
insert into food_item(food_item_id,name,price,food_category_id) values( 116,'Vanilla Comb',280,7);
insert into food_item(food_item_id,name,price,food_category_id) values( 117,'Chocolate Brownie',320,7);
insert into food_item(food_item_id,name,price,food_category_id) values( 118,'Banana Boat',270,7);
insert into food_item(food_item_id,name,price,food_category_id) values( 119,'Profitroles',210,7);
insert into food_item(food_item_id,name,price,food_category_id) values( 120,'Curd and Pavlova',250,7);



