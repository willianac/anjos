export class LocalListService {

  constructor(
    protected collection: string,
    protected primaryKey: string = '_id',
    private objectList?: object[],
    private current?: object
  ) { }

  private getRandomString(len: number = 10) {
    let str = '';
    while (len--) {
      str += String.fromCharCode(48 + ~~(Math.random() * 42));
    }
    return str;
  }

  public list() {
    return new Promise((resolve, reject) => {
      if (this.objectList) {
        resolve(this.objectList);
      } else {
        const listString = localStorage.getItem(this.collection);
        if (!listString) {
          return resolve([]);
        }
        const _list = JSON.parse(listString)
        this.objectList = _list;
        return resolve(_list);
      }
    });
  }

  public add(item: object) {
    return new Promise((resolve, reject) => {
      this.list()
        .then((_list: object[]) => {
          item[this.primaryKey] = this.getRandomString()
          _list.push(item);
          this.objectList = _list;
          localStorage.setItem(this.collection, JSON.stringify(_list));
          if (!this.current) {
            this.setCurrent(item);
          }
          resolve(item);
        })
        .catch(err => reject(err));
    });
  }

  public clear() {
    return new Promise((resolve, reject) => {
      this.objectList = [];
      localStorage.removeItem(this.collection);
    });
  }

  public update(item: object) {
    return new Promise((resolve, reject) => {
      this.list()
        .then((_list: object[]) => {
          let updated = false;
          _list.forEach((value, index) => {
            if (value[this.primaryKey] === item[this.primaryKey]) {
              _list[index] = item;
              updated = true;
              return localStorage.setItem(this.collection, JSON.stringify(_list));
            }
          });
          return resolve(updated);
        })
        .catch(err => reject(err));
    })
  }

  public delete(id: string) {
    return new Promise((resolve, reject) => {
      this.list()
        .then((_list: object[]) => {
          _list.forEach((value, index) => {
            if (value[this.primaryKey] === id) {
              _list.splice(index, 1);
              this.objectList = _list;
              return localStorage.setItem(this.collection, JSON.stringify(_list));
            }
          })
        })
        .then(() => {
          if (this.current && this.current[this.primaryKey] === id) {
            return this.setCurrent(this.objectList[0] || null);
          } else {
            return 0;
          }
        })
        .then(() => resolve(1))
        .catch(err => reject(err));
    })
  }

  public get(id: string) {
    return new Promise((resolve, reject) => {
      this.list()
        .then((_list: object[]) => {
          _list.forEach((value, index) => {
            if (value[this.primaryKey] === id) {
              return resolve(value);
            }
          })
          return resolve(null);
        })
        .catch(err => reject(err));
    })
  }

  public setCurrent(item: object) {
    return new Promise((resolve, reject) => {
      localStorage.setItem(this.collection + 'Current', JSON.stringify(item))
      this.current = item;
      resolve();
    });
  }

  public getCurrent() {
    return new Promise((resolve, reject) => {
        if (this.current) {
          resolve(this.current);
        } else {
          const item = localStorage.getItem(this.collection + 'Current');
          resolve(JSON.parse(item));
        }
    });
  }

}
