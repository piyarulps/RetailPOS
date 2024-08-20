import { Injectable } from '@angular/core';
import { Client } from 'elasticsearch-browser';
import * as elasticsearch from 'elasticsearch-browser';
import { environment } from 'src/environments/environment';

@Injectable({
	providedIn: 'root'
})
export class ElasticsearchService {

	private client: Client;

	constructor() {
		if (!this.client) {
			this._connect();
		}
	}

	private connect() {
		this.client = new Client({
			// host: 'http://137.117.70.227:9200/',
			host: environment.elasticUrl,
			//log: 'trace'
		});
	}

	private _connect() {
		this.client = new elasticsearch.Client({
			// host: 'http://137.117.70.227:9200/',
			host: environment.elasticUrl,
			//log: 'trace'
		});
	}

	isAvailable(): any {
		return this.client.ping({
			requestTimeout: Infinity,
			body: 'hello grokonez!'
		});
	}

	fullTextSearch(_index, _field, _queryText, SearchField): any {
		return this.client.search({
			index: _index,
			filterPath: ['hits.hits._source', 'hits.total', '_scroll_id'],
			body: {
				'query': {
					'match_phrase_prefix': {
						[_field]: _queryText,
					}
				},
				"from": 1,
				"size": 50
			}
			// response for each document with only '_SearchList fields
		});
	}
	nacsData(_index, pageOffset, pageLimit, colname, order_by): any {
		return this.client.search({
			index: _index,
			filterPath: ['hits.hits._source', 'hits.total', '_scroll_id'],
			body: {
				'query': {
					'match_all': {},
				},
				"from": pageOffset * pageLimit,
				"size": pageLimit
			}
		});
	}
	nacsDataSearch(_index, pageOffset, pageLimit, _queryText): any {
		return this.client.search({
			index: _index,
			filterPath: ['hits.hits._source', 'hits.total', '_scroll_id'],
			body: {
				'query': {
					"multi_match": {
						"fields": ["nacs_category", "nacs_subcategory"],
						"query": _queryText,
						"type": "phrase_prefix"
					}
				},
				"from": pageOffset * pageLimit,
				"size": pageLimit
			}
		});
	}

}

