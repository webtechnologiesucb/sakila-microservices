const express = require("express");
const soap = require("soap");
const axios = require("axios");

const app = express();
const port = 3002;

// Definir el servicio SOAP
const service = {
  FilmService: {
    FilmPort: {
      getFilmStats: async function (args, callback) {
        try {
          const response = await axios.get("http://localhost:3001/films");
          const films = response.data;

          if (films.length === 0) {
            return callback(null, {
              total: 0,
              minYear: null,
              maxYear: null,
              avgYear: null,
            });
          }

          const total = films.length;
          const minYear = Math.min(...films.map((film) => film.release_year));
          const maxYear = Math.max(...films.map((film) => film.release_year));
          const avgYear =
            films.reduce((sum, film) => sum + film.release_year, 0) / total;

          return callback(null, {
            total,
            minYear,
            maxYear,
            avgYear: avgYear.toFixed(2),
          });
        } catch (error) {
          console.error("Error obteniendo datos:", error);
          return callback(error);
        }
      },
    },
  },
};

// Definir el archivo WSDL
const xml = `
<definitions name="FilmService" xmlns="http://schemas.xmlsoap.org/wsdl/" xmlns:tns="http://example.com/FilmService" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/">
  <types>
    <xsd:schema>
      <xsd:element name="getFilmStatsRequest" type="xsd:string"/>
      <xsd:element name="getFilmStatsResponse">
        <xsd:complexType>
          <xsd:sequence>
            <xsd:element name="total" type="xsd:int"/>
            <xsd:element name="minYear" type="xsd:int"/>
            <xsd:element name="maxYear" type="xsd:int"/>
            <xsd:element name="avgYear" type="xsd:float"/>
          </xsd:sequence>
        </xsd:complexType>
      </xsd:element>
    </xsd:schema>
  </types>
  <message name="getFilmStatsRequest">
    <part name="request" type="xsd:string"/>
  </message>
  <message name="getFilmStatsResponse">
    <part name="response" type="tns:getFilmStatsResponse"/>
  </message>
  <portType name="FilmPortType">
    <operation name="getFilmStats">
      <input message="tns:getFilmStatsRequest"/>
      <output message="tns:getFilmStatsResponse"/>
    </operation>
  </portType>
  <binding name="FilmBinding" type="tns:FilmPortType">
    <soap:binding style="document" transport="http://schemas.xmlsoap.org/soap/http"/>
    <operation name="getFilmStats">
      <soap:operation soapAction=""/>
      <input>
        <soap:body use="literal"/>
      </input>
      <output>
        <soap:body use="literal"/>
      </output>
    </operation>
  </binding>
  <service name="FilmService">
    <port name="FilmPort" binding="tns:FilmBinding">
      <soap:address location="http://localhost:${port}/wsdl"/>
    </port>
  </service>
</definitions>
`;

app.use(express.json());

app.listen(port, () => {
  console.log(`Servicio WSDL corriendo en http://localhost:${port}/wsdl`);
});

soap.listen(app, "/wsdl", service, xml);