# MMM-Transilien
Local transport in Ile de France Region module for MagicMirror², a projet created by [Michael Teeuw](https://github.com/MichMich/MagicMirror)

This module is working thanks to *** TO BE DONE ----
It gives in real time next train (transilien) of the station of your choice using SNCF API "temps réel transilien"


## SNCF OpenData

A law was voted to force public companies to open some of their data to the public.
More info about the api
(https://ressources.data.sncf.com/explore/dataset/api-temps-reel-transilien/)

## Installation

Clone the git in the /modules folder of MM and run the "npm install" command


## Configuration

1- You need to find your train station and find the **UIC** of the train station. You can look [here](https://ressources.data.sncf.com/explore/dataset/sncf-gares-et-arrets-transilien-ile-de-france/table/?sort=libelle)

2- You need to build the API URL: http://api.transilien.com/gare/**[STATION_UIC]**/depart/

## Further information and support

Please use the forum of magic mirror² https://forum.magicmirror.builders/