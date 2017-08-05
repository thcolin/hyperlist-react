# HyperListReact
Simple React wrapper for [tbranyen/hyperlist](https://github.com/tbranyen/hyperlist/), see `examples` folder for complete `html` and `css` example

## Installation
Warning, `hyperlist` is a peer dependency
```bash
npm i -S hyperlist hyperlist-react
```

## Usage
```javascript
class MyVirtualList extends React.Component {
  render() {
    <HyperListReact
      height={window.innerHeight}
      itemHeight={30}
      total={100000}
      reverse={false}
      generate={this.generate}
    />
  }

  generate(row) {
    return (
      <div>{ 'Item ' + row }</div>
    )
  }
}
```

## Tests
Just run `npm test` :
* Currently testing only `constructor`

## TODO
* Update `hyperlist` dependency from `fork` to `origin` when [tbranyen/hyperlist #38](https://github.com/tbranyen/hyperlist/pull/38) is merged
