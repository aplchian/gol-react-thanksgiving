const React = require('react')
const gol = require('gol-functional')
const {style,merge} = require('glamor')

const db = style({
  display: 'block',
  height: 40
})

const di = style({
  display: 'inline-block'
})

const alive = style({
  background: 'url(./images/turkey.png) no-repeat center center',
  backgroundSize: '40px 40px'
})

const dead = style({
  backgroundColor: 'inherit'
})

const box = style({
  width: 40,
  height: 40,
  border: '1px solid rgb(214, 214, 214)',
})

const container = style({
  display: 'block',
  margin: '0 auto',
  width: '70%'
})

const makeSim = (size,speed,that) => {
  return gol({
      size: size,
      speed: speed,
      generate: true
    }, (board) => {
      that.setState({board: board})
    })
}

const App = React.createClass({
  getInitialState(){
    return({
      sim: null,
      board: [],
      speed: 1000,
      size: 10
    })
  },
  componentDidMount(){
    this.setState({
      sim: gol({
          size: this.state.size,
          speed: this.state.speed,
          generate: true
        }, (board) => {
          this.setState({board: board})
        })
    })
  },
  handleChange(path){
    return e => {
      e.preventDefault()
      let currentState = this.state
      currentState[path] = parseInt(e.target.value)
      let that = this
      let gol = makeSim(this.state.size,this.state.speed,that)
      this.setState({
        sim: gol
      })
    }
  },
  start(e){
    e.preventDefault()
    this.state.sim.start()
    setTimeout(_ => this.state.sim.stop(), 30000)
  },
  stop(e){
    e.preventDefault()
    this.state.sim.stop()
  },
  toggleCell(pos){
    return e => {
      this.state.sim.toggle(pos.position[0],pos.position[1])
      let board = this.state.board
      let current = board[pos.position[0]][pos.position[1]]
      let newState = current === 1 ? 0 : 1
      board[pos.position[0]][pos.position[1]] = newState
      this.setState({
        board: board
      })
    }
  },
  render () {
    var rowI
    const createColumns = (item, i) => {
      let color = item === 1 ? alive : dead
      var position = [rowI,i]
      return <div key={i} {...merge(di,box,color)} onClick={this.toggleCell({position})}></div>
    }

    const createRow = (item, i) => {
      rowI = i
      let row = item.map(createColumns)
      return <div key={i} {...db}>{row}</div>
    }
    return (
      <div {...container}>
        <h1>Gobble Gobble!</h1>
        <form>
          <div>
            <label>Size ex. 10</label>
            <input type="number" onChange={this.handleChange('size')}/>
          </div>
          <div>
            <label>Speed ex. 3000</label>
            <input type="number" onChange={this.handleChange('speed')}/>
          </div>
        </form>
        {this.state.board.map(createRow)}

        <button onClick={this.start}>Start</button>
        <button onClick={this.stop}>Stop</button>

      </div>
    )
  }
})

module.exports = App
