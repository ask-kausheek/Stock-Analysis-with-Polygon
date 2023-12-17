// Stocks - Grouped Daily (Bars)
// https://polygon.io/docs/stocks/get_v2_aggs_grouped_locale_us_market_stocks__date
// https://github.com/polygon-io/client-go/blob/master/rest/aggs.go
package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"reflect"
	"time"

	polygon "github.com/polygon-io/client-go/rest"
	"github.com/polygon-io/client-go/rest/models"
)

const (
	PoligonPath     = "https://api.polygon.io"
	TickerPath      = "/v3/reference/tickers"
	DailyValuesPath = "/v1/open-close"
	ListTicker      = "/v2/aggs/grouped/locale/us/market/stocks/2023-01-09?adjusted=true&"
)

var (
	Port       string
	ApiKey     string
	Tickerdata string // Make the API request to get opening price for a specific stock (e.g., AAPL for Apple)
)

func initial() *polygon.Client {

	ApiKey = os.Getenv("POLYGON_API_KEY")
	fmt.Printf("%v", ApiKey)
	Port = "3000"
	// init client
	c := polygon.New(ApiKey)
	return c
}

func MakeURL(parts ...string) string {
	var result = PoligonPath
	for _, part := range parts {
		result += part
	}
	return result + "apiKey=" + ApiKey

}

func Top20StockInfo() {

	// Open the file
	inputFile, err := os.Open("post.json")
	if err != nil {
		fmt.Println("Error opening file:", err)
		return
	}
	defer inputFile.Close()

	// Create a new file for writing
	outputFile, err := os.Create("../frontend/public/Top20_items.json")
	if err != nil {
		fmt.Println("Error creating output file:", err)
		return
	}
	defer outputFile.Close()

	// Decode JSON data into the struct
	var response *models.GetGroupedDailyAggsResponse
	decoder := json.NewDecoder(inputFile)
	err = decoder.Decode(&response)
	if err != nil {
		fmt.Println("Error decoding JSON:", err)
		return
	}

	// Select the first 20 items from Results array
	var first20Results []models.Agg
	if len(response.Results) < 20 {
		first20Results = response.Results
	} else {
		first20Results = response.Results[:20]
	}

	// Marshal the first 20 items back to JSON
	outputData, err := json.MarshalIndent(first20Results, "", "    ")
	if err != nil {
		fmt.Println("Error marshaling JSON:", err)
		return
	}

	// Write the JSON data to the output file
	_, err = outputFile.Write(outputData)
	if err != nil {
		fmt.Println("Error writing to output file:", err)
		return
	}

	fmt.Println("First 20 items of Results written to Top20_items.json successfully!")

}

func main() {

	c := initial()

	url := MakeURL("/v2/snapshot/locale/us/markets/stocks/tickers/%s?")
	fmt.Printf("URL : %s\n", url)

	// set params
	params := models.GetGroupedDailyAggsParams{
		Locale:     models.US,
		MarketType: models.Stocks,
		Date:       models.Date(time.Date(2023, 3, 8, 0, 0, 0, 0, time.Local)),
	}.WithAdjusted(true)

	// make request
	res, err := c.GetGroupedDailyAggs(context.Background(), params)
	if err != nil {
		log.Fatal(err)
	}
	log.Printf("Type of data fetched%T", reflect.TypeOf(res))
	// do something with the result
	Top20StockInfo()

}
