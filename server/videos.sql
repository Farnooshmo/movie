CREATE TABLE videos (id SERIAL PRIMARY KEY,
                                        title VARCHAR(2500) NOT NULL,
                                            url VARCHAR(250) NOT NULL,
                                                rating INTEGER NOT NULL );


INSERT INTO videos (title, url, rating)VALUES ('Book 100s of Appointments Every Single Month With Ideal Clients
', 'https://www.youtube.com/watch?v=qzoq1NSIpzw', 1964);