<template>
<div class="content">
  <div class="time">{{time}}</div>
  <div class="score">{{score}}</div>
  <div>
    <button @click="startGame()">restart</button>
  </div>
  <br>
  <div class="box" @keyup.up="move('up')">
    <div id="start" v-show='start'>
      <button @click='startGame()'>start</button>
    </div>
    <div id="gameover" v-show='gameOver'>
      <h1>Game Over</h1>
      <button @click='startGame()'>tryAgain</button>
    </div>
    <transition-group name="num-list" tag="div">
      <span class="num" v-for="item in gamedata" :class="'tile-'+item.value" :style="{top:item.y*100+'px',left:item.x*100+'px'}" :key="item.key">{{item.value}}</span>
    </transition-group>
  </div>
</div>
</template>
<script>
export default {
  name: 'Game2048',
  data() {
    return {
      key: 0,
      start: true,
      score: 0,
      time: 0,
      gamedata: [],
      timer: '', //定时器
      gameOver: false,
    }
  },
  computed: {
    //x方向为基准将gamedata中数据分组
    gamedata_x: function() {
      let temporary = [];
      if (this.gamedata) {
        for (let i = 0; i < 4; i++) {
          temporary.push(this.gamedata.filter((item) => {
            return item.x === i;
          }))
        }
      };
      temporary.forEach((item) => {
        item.sort((a, b) => {
          return a.y - b.y
        })
      })
      return temporary
    },

    gamedata_y: function() {
      let temporary = [];
      if (this.gamedata) {
        for (let i = 0; i < 4; i++) {
          temporary.push(this.gamedata.filter((item) => {
            return item.y === i
          }))
        }
      }
      temporary.forEach((item) => {
        item.sort((a, b) => {
          return a.x - b.x
        })
      })

      return temporary
    }
  },

  methods: {

    startGame: function(el) {
      this.key = 0;
      this.start = false;
      this.gameOver = false;
      this.source = 0;
      this.gamedata = [];
      this.time = 0;
      clearInterval(this.timer);
      this.timer = setInterval(() => {
        this.time += 1
      }, 1000);
      window.addEventListener("keydown", this.KeyEventListener, false);
      this.addData();
      this.addData();
    },

    reset: function() {
      this.gamedata = [],
        this.start = true,
        this.score = 0,
        this.time = 0,
        this.direct = '',
        this.gameOver = false,
        clearInterval(this.timer);
      window.removeEventListener("keydown", this.KeyEventListener)
    },

    //keydown事件
    KeyEventListener: function(event) {
      switch (event.keyCode) {
        case 38:
          this.move('up');
          break;
        case 40:
          this.move('down');
          break;
        case 37:
          this.move('left');
          break;
        case 39:
          this.move('right');
          break;
      }
    },

    addData: function() {
      if (this.gamedata.length === 16) {
        return
      }
      let _x = Math.floor(Math.random() * 4);
      let _y = Math.floor(Math.random() * 4);
      let _value = Math.random() > 0.9 ? 4 : 2;
      let sameAddr = false; //是否有重复标志
      this.gamedata.forEach((item) => {
        if (item.x === _x && item.y === _y) {
          sameAddr = true
        }
      })
      if (!sameAddr) {
        this.gamedata.push({
          x: _x,
          y: _y,
          value: _value,
          key: this.key += 1
        })
      } else {
        this.addData()
      }

    },


    move: function(dir) {
      let canMove = false;
      switch (dir) {
        case 'up':
          this.move_up();
          break;
        case 'down':
          this.move_down();
          break;
        case 'left':
          this.move_left();
          break;
        case 'right':
          this.move_right();
          break;
        default:
          break;
      }
      this.gamedata_x.forEach((item) => {
        if (item.length <= 1) {
          return
        } else {
          for (let i = 0; i < item.length - 1; i++) {
            if (item[i].value === item[i + 1].value) {
              canMove = true;
              break;
            }
          }
        }
      });
      if (canMove = false) {
        this.gamedata_y.forEach((item) => {
          if (item.length <= 1) {
            return
          } else {
            for (let i = 0; i < item.length - 1; i++) {
              if (item[i].value === item[i + 1].value) {
                canMove = true;
                break;
              }
            }
          }
        });
      }

      if (canMove === false && this.gamedata.length === 16) {
        this.gameOver = true;
        this.gamedata = [];
        clearInterval(this.timer);
      }

    },


    move_up: function() {
      let move_flag //判断是否移动过的标志
      const align = () => {
        this.gamedata_x.forEach((item) => {
          let length = item.length;
          if (length !== 0) {
            for (let i = 0; i < length; i++) {
              if (item[i].y !== i) {
                move_flag = true
              }
              item[i].y = i
            }
          }
        })
      }
      align();
      move_flag = (this.eliminate('up') ? true : false) || move_flag;
      if (move_flag) {
        align();
        setTimeout(this.addData, 100);
      }
    },

    move_down: function() {
      let move_flag
      const align = () => {
        this.gamedata_x.forEach((item) => {
          let length = item.length;
          if (length > 0) {
            for (let i = length - 1, j = 3; i >= 0; i--, j--) {
              if (item[i].y !== j) {
                move_flag = true
              }
              item[i].y = j
            }
          }
        })
      }
      align();
      move_flag = (this.eliminate('down') ? true : false) || move_flag
      if (move_flag) {
        align();
        setTimeout(this.addData, 100);
      }
    },

    move_right: function() {
      let move_flag
      const align = () => {
        this.gamedata_y.forEach((item) => {
          let length = item.length;
          if (length !== 0) {
            for (let i = length - 1, j = 3; i >= 0; i--, j--) {
              if (item[i].x !== j) {
                move_flag = true
              }
              item[i].x = j
            }
          }
        })
      }
      align();
      move_flag = (this.eliminate('right') ? true : false) || move_flag
      if (move_flag) {
        align();
        setTimeout(this.addData, 100);
      }
    },

    move_left: function() {
      let move_flag
      const align = () => {
        this.gamedata_y.forEach((item) => {
          let length = item.length;
          if (length !== 0) {
            for (let i = 0; i < length; i++) {
              if (item[i].x !== i) {
                move_flag = true
              }
              item[i].x = i
            }
          }
        })
      }
      align();
      move_flag = (this.eliminate('left') ? true : false) || move_flag
      if (move_flag) {
        align();
        setTimeout(this.addData, 100);
      }
    },

    //合并相同值
    eliminate: function(dir) {
      let eliminate_flag = false;
      switch (dir) {
        case 'up':
          this.gamedata_x.forEach((item) => {
            if (item.length <= 1) {
              return
            } else {
              for (let i = 0; i < item.length - 1; i++) {
                if (item[i].value === item[i + 1].value) {
                  let index = this.gamedata.indexOf(item[i + 1]);
                  item[i + 1].x = item[i].x;
                  item[i + 1].y = item[i].y;
                  item[i].value *= 2;
                  this.score += item[i].value;
                  this.gamedata.splice(index, 1);
                  eliminate_flag = true;
                  i += 1;
                }
              }
            }
          });
          break;

        case 'down':
          this.gamedata_x.forEach((item) => {
            if (item.length <= 1) {
              return
            } else {
              for (let i = item.length - 1; i > 0; i--) {
                if (item[i].value === item[i - 1].value) {
                  let index = this.gamedata.indexOf(item[i - 1]);
                  item[i - 1].x = item[i].x;
                  item[i - 1].y = item[i].y;
                  item[i].value *= 2;
                  this.score += item[i].value;
                  this.gamedata.splice(index, 1);
                  eliminate_flag = true;
                  i -= 1;
                }
              }
            }
          });
          break;

        case 'left':

          this.gamedata_y.forEach((item) => {
            if (item.length <= 1) {
              return
            } else {
              for (let i = 0; i < item.length - 1; i++) {
                if (item[i].value === item[i + 1].value) {
                  let index = this.gamedata.indexOf(item[i + 1]);
                  item[i + 1].x = item[i].x;
                  item[i + 1].y = item[i].y;
                  item[i].value *= 2;
                  this.score += item[i].value;
                  this.gamedata.splice(index, 1);
                  eliminate_flag = true;
                  i += 1;
                }
              }
            }
          });
          break;

        case 'right':

          this.gamedata_y.forEach((item) => {
            if (item.length <= 1) {
              return
            } else {
              for (let i = item.length - 1; i > 0; i--) {
                if (item[i].value === item[i - 1].value) {
                  let index = this.gamedata.indexOf(item[i - 1]);
                  item[i - 1].x = item[i].x;
                  item[i - 1].y = item[i].y;
                  item[i].value *= 2;
                  this.score += item[i].value;
                  this.gamedata.splice(index, 1);
                  eliminate_flag = true;
                  i -= 1;
                }
              }
            };
          });
          break;
        default:
          break;
      }

      return eliminate_flag;
    }

  },

}
</script>
<style scoped>
* {
  margin: 0;
  padding: 0;
}

#start {
  height: 100%;
  width: 100%;
  text-align: center;
  padding-top: 150px;
  position: absolute;
}

#gameover {
  height: 100%;
  width: 100%;
  text-align: center;
  padding-top: 150px;
  position: absolute;
}

#start button {
  height: 80px;
  width: 120px;
  font-size: 30px;
  border: 0px;
  color: #77ACD6;
  border-radius: 20px;
}

#gameover button {
  height: 80px;
  width: 120px;
  font-size: 30px;
  border: 0px;
  color: #77ACD6;
  border-radius: 20px;
}

.content {
  text-align: center;
}

.time,
.score {
  height: 35px;
  width: 100px;
  border-radius: 5px;
  background-color: #29CEEA;
  display: inline-block;
  text-align: center;
  font-size: 28px;
}

.time {
  margin-right: 30px;
}

.box {
  height: 400px;
  width: 400px;
  border: 5px solid #776e65;
  border-radius: 5px;
  background-color: #776e65;
  display: inline-block;
  position: relative;
  margin: 10px;
  overflow: hidden;
}

.num {
  height: 60px;
  width: 90px;
  line-height: 35px;
  position: absolute;
  text-align: center;
  font-size: 45px;
  padding-top: 30px;
  color: #776e65;
  border-radius: 10px;
  border: 5px solid #776e65;
}

.num-list-move {
  transition: all 0.1s;
}


.num-list-enter-active {
  animation: enter 0.1s;
}

@keyframes enter {
  0% {
    transform: scale(0.9, 0.9);
  }

  100% {
    transform: scale(1, 1);
  }
}

.tile-2 {
  background-color: #eee4da;
}

.tile-4 {
  background-color: #ede0c8;
}

.tile-8 {
  color: #f9f6f2;
  background: #f2b179;
}

.tile-16 {
  color: #f9f6f2;
  background: #f59563;
}

.tile-32 {
  color: #f9f6f2;
  background: #f67c5f;
}

.tile-64 {
  color: #f9f6f2;
  background: #f65e3b;
}

.tile-128 {
  color: #f9f6f2;
  background: #edcf72;
  font-size: 45px;
}



.tile-256 {
  color: #f9f6f2;
  background: #edcc61;
  font-size: 45px;
}

.tile-512 {
  color: #f9f6f2;
  background: #edc850;
  font-size: 45px;
}

.tile-1024 {
  color: #f9f6f2;
  background: #edc53f;
  font-size: 35px;
}

.tile-2048 {
  color: #f9f6f2;
  background: #edc22e;
  font-size: 35px;
}
</style>
