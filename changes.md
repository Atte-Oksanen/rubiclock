## Alla listattuna kaikki poikkeamat suunnitelmasta
* Päänäkymä
    * Tarkastuskello
        * Alkuperäisenä ideana oli toteuttaa tarkastuskello integroituna pääkelloon, mutta huomasimme sen aiheuttavan hämmennystä varsinkin ensimmäistä kertaa järjestelmää käyttäessä, joten lisäsimme sille erillisen elementin.
    * Apuviesti
        * Käsi-ikonien läheisyydessä olevaan apuviestiin lisättiin linkki järjestelmän käyttöohjeisiin.
    * Statistiikkalaatikot
        * Lisäsimme statistiikkalaatikoihin lisää reunoja luettavuuden parantamiseksi
        * Lisäsimme painikkeen viimeisen viiden ajan keskiarvojen nollaamiseen sekä istunnon sisäisten aikojen lataamiseen. Molemmista toiminnoista mainittiin vaatimusmäärittelyssä, mutta niitä ei ollut toteutettu prototyyppiin.
        * Poistimme laatikosta erillisten aikojen DNF-painikkeet, sillä järjestelmämme ei pysty tarkistamaan mahdollisia hylättyjä suorituksia.
        * Siirsimme "+2" -painikkeen "Share"-näyttöön. Vain viimeisimmän ajan pystyy lataamaan tulostaululle, joten aikaisempien tulosten vieressä oleva painike vain huononsi elementin luettavuutta
* Asetukset
    * Kellon aktivointi näppäimistöltä onnistuu vain välilyönnillä
        * Testatessamme järjestelmää, pienempien näppäinten käyttö johti vaikeuksiin kellon pysäyttämisessä, emmekä nähneet tämän toiminnallisuuden tuovan lisäarvoa järjestelmään.
    * Lisäohjeet asetuksissa
        * Lisäsimme asetuksiin huomautuksen asetusten muuttamisen vaikutuksesta istunnon sisäisiin aikoihin.
* Tulostaulu
    * Tulosten luettavuus
        * Lisäsimme tulostaululle elementtien väliset viivat luettavuuden parantamiseksi.
        * Lisäsimme myös taustavärin tulostaulun kehykseen luettavuuden parantamiseksi.
* Ohjesivu
    * Sisällysluettelo
        * Teimme sisällysluettelosta perinteisemmän valikon listan sijasta käytön sujuvuuden lisäämiseksi
    * Tekstisisältö
        * Itse sisältöä ei ollut mallinnettu prototyypissä, mutta jaoimme kappaleet toisistaa vaakaviivoilla luettavuuden parantamiseksi.