import 'rxjs/Rx';
import {Observable} from "rxjs/Rx";

// Angular
import {Injectable}     from '@angular/core';
import {Headers, Http} from "@angular/http";

// Angular JWT libary used for authentication
import {AuthHttp} from 'angular2-jwt/angular2-jwt';

@Injectable()
export class RequestService {

  /*
   * ====================================
   *   REQUEST SERVICE
   * ====================================
   *
   * The request service is the only service that actually handles request to the server.
   * What this means is that all the other services uses the request method to retrieve their data
   * from server.
   *
   * The class has two methods:
   *
   * 1. Public request which handles all the requests to server
   *
   *    Params: method  : string
   *            url     : string
   *            key     : string (Optional)
   *            data    : any (Optional)
   *
   *    Returns: Observable
   *
   *
   * 2. Public invalidate which invalidates cached data based in a key
   *
   *    Params: key     : string
   *
   *    Returns: void
   *
   */

  // Dictionary that stores all the data related to jobs
  private cachedData:{};

  // Variable to hold default headers
  private header:Headers;

  constructor(
    private http: Http,
    private authHttp:AuthHttp
  ) {

    /*
     * ====================================
     *   DEFAULT HEADERS
     * ====================================
     *
     * These headers are used for all post requests as of today
     *
     */

    this.header = new Headers();
    this.header.append('Content-Type', 'application/json');


    /*
     * The dict is initialized as a empty dict and later filled when different
     * requests are initiated
     */

    this.cachedData = {};

  }

  /*
   * =======================================================
   *   MAIN REQUEST METHOD
   * =======================================================
   */

  public request(method:string, url:string, key?:string, data?:any) {

    /*
     * This method is used to handle all types of requests, and does caching on client
     * side based on different keys.
     */

    // If cache exist the data is returned as an observable object
    if (key && this.cachedData[key] && method != 'post') {
      return Observable.create(observer => {
        observer.next(this.cachedData[key]);
        observer.complete();
      });
    }

    /*
    *
    * What class we want to use to generate requests to the server depends on
    * if the user is logged in or not. To check that a user is logged in, we
    * check if there are a token stored in the local storage.
    *
    */

    // Retrieves the token from local storage
    var token = localStorage.getItem('id_token');

    // Declares a variable to be initialized with the correct class
    var http;


    if (token)
      // A token is present, so we assume that the user is logged in
      http = this.authHttp;
    else
      // There are no token present, so we assume that the user is not logged in
      http = this.http;

    /*
     * If the method continues to this point, it means that no cached values was found
     * and that we need to request new information from the server
     */

    switch (method) {
      case 'POST': // The method is of type post
        var body = JSON.stringify(data);
        return http.post(url, body, {headers: this.header});

      case 'PUT': // The method is of type put
        var body = JSON.stringify(data);
        return http.put(url, body, {headers: this.header});

      case 'GET': // The method is of type get
        return http.get(url)
          .do(res => {

            // The value is saved in the cache dict if key is provided
            if (key)
              this.cachedData[key] = res;
          });
    }
  }

  /*
   * =======================================================
   *   INVALIDATION METHOD
   * =======================================================
   */

  public invalidate(key) {

    /*
     *
     * This method is used every time the cached data needs to be
     * invalidated. The invalidation happens based on a provided key
     *
     */

    delete this.cachedData[key];
  }
}
