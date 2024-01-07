create user trackpe with password 'trackpe1234';
drop database IF EXISTS trackpe_core;
drop database IF EXISTS trackpe_test;
create database trackpe_core owner trackpe;
create database trackpe_test owner trackpe;
