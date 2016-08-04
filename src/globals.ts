//
// ===== File globals.ts
//

'use strict';

/*
 * ============= BASE URL =============
 */

export var baseURL: string;

/*
 * ============= API URL =============
 */

export var apiUrl: string;


/*
 * ============= Checks ENV ==============
 */

if ('development' === ENV) {
  baseURL = '52.50.237.236';
  apiUrl = baseURL + '/';

} else {
  baseURL = '52.50.237.236';
  apiUrl = baseURL + '/';
}
