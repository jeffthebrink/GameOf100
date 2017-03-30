class Player {
    constructor(number) {
        this.number = number;
        this.name = "Player " + number;
        this.connected = false;
        this.bid = 0;
    }
}

class Card {
    constructor(name, rank, suit) {
        this.name = name;
        this.rank = rank;
        this.suit = suit;
    }
}

class Form {
    constructor(data) {
        this.originalData = data;
        for (let field in data) {
            this[field] = data[field];
        }
        this.errors = new Errors();
    }

    getData() {
        let data = Object.assign({}, this);
        delete data.originalData;
        delete data.errors;
        return data;
    }

    submit(url) {
        return new Promise((resolve, reject) => {
            axios.post(url, this.getData())
                .then(response => {
                    this.onSuccess(response.data);
                    resolve(response.data);
                })
                .catch(error => {
                    this.onFail(error.data);
                    reject(error.data);
                });
        });
    }

    onSuccess(data) {
        this.reset();
    }

    onFail(errors) {
        this.errors.record(errors);
    }

    reset() {
        for (let field in this.originalData) {
            this[field] = '';
        }
        this.errors.clear();
    }
}

class Errors {
    constructor() {
        this.errors = {};
    }

    has(field) {
        return this.errors.hasOwnProperty(field);
    }

    any() {
        return Object.keys(this.errors).length > 0;
    }

    get(field) {
        if (this.errors[field]) {
            return this.errors[field];
        }
    }

    record(errors) {
        this.errors = errors;
    }

    // $event.target.name gives field that they type in
    clear(field) {
        if (field) {
            delete this.errors[field];
        } else {
            this.errors = {};
        }
    }
}

const globalData = {
    stage: "login",
    players: {
        1: new Player(1),
        2: new Player(2),
        3: new Player(3),
        4: new Player(4)
    },
    user: undefined,
    leader: undefined,
    trump: 0
};

Vue.component('cheat-sheet', {
    template: `
    <div class="col-md-2" style="background-color: black; opacity: 0.5; color: white">
        <h4>Cheat Sheet</h4>
        Ace: 1<br>
        King/Opposite King: 25<br>
        Queen: 0<br>
        Jack/Opposite Jack: 1<br>
        10: 1<br>
        9/Opposite 9: 9<br>
        5/Opposite 5: 5<br>
        2: 1<br>
        Joker: 17<br>
        All Other Cards: 0
    </div>
    `
});

Vue.component('banner', {
    props: {
        player: {
            type: Player,
            required: true
        }
    },
    template: `
    <div class="col-md-4 col-md-offset-2" style="margin-top: 100px">
        <div class="col-md-12" style="background-color: black; opacity: 0.5; color: white">
            <h3>Stage: {{ stage }}</h3>
        </div>
        <div class="col-md-12" style="background-color: black; opacity: 0.5; color: white; margin-top: 10px">
            <h4>{{ stageMessage }}</h4>
        </div>
    </div>
    `,
    data: function() {
        return {
            stage: this.$root.$data.global.stage
        };
    },
    computed: {
        stageMessage: function() {
            if (this.stage === "bidding") {
                return 'Current Bidder: ' + this.player.name;
            } else if (this.stage === "reduce") {
                return 'Cat Winner: ' + this.player.name;
            }
        }
    }
});

Vue.component('scoreboard', {
    template: `
    <div>
        <div style="margin-left: 10px">
            <table style="display: inline-block">
                <tr><th>Team 1</th></tr>
                <tr><td>{{team1Score}}</td></tr>
            </table>

            <table style="display: inline-block; margin-left: 70px">
                <tr><th>Team 2</th></tr>
                <tr><td>{{team2Score}}</td></tr>
            </table>
        </div>

        <table>
            <tr>
                <th>Team 1</th>
                <th>Bid Info</th>
                <th>Team 2</th>
            </tr>
            <tr v-for="round in runningScoreInfo">
                <td> {{round.team1}} </td>
                <td> <span v-if="round.bidTeam == 1" class="glyphicon glyphicon-arrow-left"></span> {{round.bid}} <span v-if="round.bidTeam == 2" class="glyphicon glyphicon-arrow-right"></span> </td>
                <td> {{round.team2}} </td>
            </tr>
        </table>
    </div>
    `,
    data: function() {
        return {
            team1Score: 0,
            team2Score: 0,
            runningScoreInfo: undefined,
            scoreboardCheck: undefined // used to stop timeout on destroy
        };
    },
    mounted: function() {
        this.getScoreboard();
    },
    beforeDestroy: function() {
        clearTimeout(this.scoreboardCheck);
    },
    methods: {
        getScoreboard: function() {
            var compThis = this;
            axios.get('/scoreboard')
                .then(response => {
                    compThis.team1Score = response.data.team1Score;
                    compThis.team2Score = response.data.team2Score;
                    compThis.runningScoreInfo = response.data.runningScoreInfo;
                });
            this.scoreboardCheck = setTimeout(this.getScoreboard, 5000);
        }
    }
});

Vue.component('bid-grid', {
    props: ['players', 'currentBidder'],
    template: `
    <div class="col-md-4 col-md-offset-4">
        <bid-box v-for="player in players" :player="player" :currentBidder="currentBidder" ></bid-box>
    </div>
    `,
});

Vue.component('bid-box', {
    props: ['player', 'currentBidder'],
    template: `
    <div class="col-md-6">
        {{ player.name }}
        <h1>{{ bidText }}</h1>
        <div v-if="myTurn">
            <form action="/bid" method="post" @submit.prevent="submitBid">
                <p>{{bidForm.bid}}</p>
                <input type="number" :min="player.bid" v-model="bidForm.bid">
                <button type="submit" :disabled="unclickable" >Bid</button>
            </form>
            <button @click="pass" :disabled="unclickable" >Pass</button>
        </div>
    </div>
    `,
    computed: {
        myTurn() {
            return (this.player == this.currentBidder) && (this.player == this.$root.$data.global.user);
        },
        bidText() {
            if (this.player.bid === 0) {
                return "--";
            } else if (this.player.bid == -1) {
                return "pass";
            } else {
                return this.player.bid;
            }
        }
    },
    data: function() {
        return {
            bidForm: new Form({
                bid: 0
            }),
            unclickable: false
        };
    },
    methods: {
        submitBid: function() {
            this.unclickable = true;
            this.bidForm.submit("/bid")
                .catch(error => {
                    this.unclickable = false;
                });
        },
        pass: function() {
            this.bidForm.bid = -1;
            this.submitBid();
        }
    }
});

// I made interactable on for reduce, DIFFERENTIATE FOR REDUCE AND PLAY
Vue.component('hand', {
    props: {
        interactable: {
            type: Boolean,
            required: true
        }
    },
    template: `
    <div class="row" style="position: absolute; bottom: 0px; width: 1200px">
        <div class="col-md-10 col-md-offset-1" style="background-color: green; padding: 10px 0px 10px 0px">
            <div v-if="interactable">
                <img v-for="card in hand" :class="card.name" class="card clickable" @click="addToDiscard(card)">
                <button :disabled="discardIsEmpty" @click="discard()">Discard</button>
            </div>
            <img v-else v-for="card in hand" :class="card.name" class="card">
        </div>
    </div>
    `,
    data: function() {
        return {
            hand: [],
            trump: this.$root.$data.global.trump,
            discardPile: [],
        };
    },
    mounted: function() {
        axios.get('/hand')
            .then(response => {
                this.loadHand(response.data.hand);
            });
    },
    methods: {
        addToDiscard: function(card) {
            var index = this.discardPile.indexOf(card);
            if (index > -1) {
                this.discardPile.splice(index, 1);
            } else {
                this.discardPile.push(card);
            }
        },
        discard: function() {
            this.discardPile = [];
            axios.post('/discard', this.discardPile)
                .then(response => {
                    this.loadHand(response.data.hand);
                });
        },
        loadHand: function(hand) {
            this.hand = [];
            hand.forEach(card => {
                this.hand.push(new Card(card.name, card.rank, card.suit));
            });
        }
    },
    computed: {
        discardIsEmpty: function() {
            return this.discardPile.length === 0;
        }
    }
});

Vue.component('cat', {
    template: `
    <div class="col-md-6 col-md-offset-3" style="background-color: cyan">
        <img v-for="card in cat" :class="card.name" class="card">
    </div>
    `,
    mounted: function() {
        var compThis = this;
        axios.get('/cat')
            .then(response => {
                response.data.cat.forEach(card => {
                    compThis.cat.push(new Card(card.name, card.rank, card.suit));
                });
            });
    },
    data: function() {
        return {
            cat: []
        };
    }
});

var loginComp = {
    template: `
    <form class="form-horizontal" style="margin-top: 100px" @submit.prevent="joinGameSubmit">
        <div class="form-group">
            <label for="username" class="col-md-1 col-md-offset-2 control-label">Name</label>
            <div class="col-md-6">
                <input type="text" class="form-control" v-model="joinGame.username" placeholder="Enter a unique name" required>
            </div>
        </div>
        <div class="form-group">
            <label class="col-md-1 col-md-offset-2 control-label">Games</label>
            <div class="col-md-6">
                <select class="form-control"  v-model="joinGame.game" required>
                    <option selected disabled value="">Choose a game</option>
                    <option v-for="game in games"> {{ game }} </option>
                </select>
            </div>
        </div>
        <div class="form-group">
            <div class="col-md-1 col-md-offset-8">
                <button class="btn btn-default" type="submit">Join Game</button>
            </div>
        </div>
    </form>
    `,
    data: function() {
        return {
            joinGame: new Form({
                name: '',
                game: ''
            }),
            games: [],
            global: this.$root.$data.global
        };
    },
    mounted: function() {
        axios.get('/games')
            .then(response => {
                this.games = response.data;
            });
    },
    methods: {
        joinGameSubmit: function() {
            this.joinGame.submit("/join-game")
                .then(data => {
                    this.global.user = this.global.players[data.user];
                    this.global.stage = "connecting";
                });
        }
    }
};

var connectingComp = {
    template: `
        <div>
            <h1 v-for="player in global.players">{{player.name}}: {{player.connected}}</h1>

        </div>
    `,
    data: function() {
        return {
            connectCheck: undefined,
            global: this.$root.$data.global
        };
    },
    mounted: function() {
        this.updateConnection();
    },
    beforeDestroy: function() {
        // clear timeout started on mount found in updateConnection
        clearTimeout(this.connectCheck);
    },
    methods: {
        updateConnection: function() {
            var thisComp = this;
            axios.get('/players')
                .then(function(response) {
                    response.data.forEach(function(player) {
                        var currentPlayer = thisComp.global.players[player.number];
                        currentPlayer.name = player.name;
                        currentPlayer.connected = player.connected;
                    });
                });
            this.connectCheck = setTimeout(this.updateConnection, 3000);
        }
    },
    computed: {
        numberConnected: function() {
            var players = this.global.players;
            var count = 0;
            for (var key in players) {
                // skip loop if the property is from prototype
                if (!players.hasOwnProperty(key)) continue;

                if (players[key].connected) {
                    count++;
                }
            }
            return count;
        }
    },
    watch: {
        numberConnected: function() {
            if (this.numberConnected >= 4) {
                this.global.stage = "bidding";
            }
        }
    }
};

var biddingComp = {
    template: `
        <div class="row">
            <cheat-sheet></cheat-sheet>
            <banner :player="currentBidder"></banner>
            <scoreboard></scoreboard>
            <bid-grid :players="global.players" :currentBidder="currentBidder"></bid-grid>
            <hand :interactable="interactable" ></hand>
        </div>
    `,
    data: function() {
        return {
            global: this.$root.$data.global,
            currentBidder: this.$root.$data.global.players[1],
            bidCheck: undefined, // to clear timeout before destroy
            interactable: false
        };
    },
    mounted: function() {
        this.updateBid();
    },
    beforeDestroy: function() {
        // clear timeout started on mount found in updateBid
        clearTimeout(this.bidCheck);
    },
    methods: {
        updateBid: function() {
            var thisComp = this;
            axios.get('/bid-info')
                .then(function(response) { // response data should have player bids, current bidder, winning bidder, winning bid
                    if (response.data.hasOwnProperty("winner")) {
                        // set leader from bid winner
                        thisComp.global.leader = thisComp.global.players[response.data.winner];
                        thisComp.global.stage = "reduce";
                        return;
                    }

                    thisComp.currentBidder = thisComp.global.players[response.data.currentBidder];
                    response.data.playerBids.forEach(function(player){
                        thisComp.global.players[player.number].bid = player.bid;
                    });
                });
            this.bidCheck = setTimeout(this.updateBid, 5000);
        }
    },
};

var reduceComp = {
    template: `
        <div>
            <cheat-sheet></cheat-sheet>
            <banner :player="global.leader" ></banner>
            <scoreboard></scoreboard>
            <cat></cat>
            <hand :interactable="interactable" ></hand>
            <button @click="postReady" :disabled="ready" >Ready</button>
        </div>
    `,
    data: function() {
        return {
            global: this.$root.$data.global,
            ready: false,
            waitCheck: undefined, // for clearing timeout on destroy
            interactable: true
        };
    },
    methods: {
        postReady: function() {
            var compThis = this;
            axios.post('/ready')
                .then(response => {
                    compThis.ready = true;
                    compThis.waitForOthers();
                })
                .catch(error => {

                });
        },
        waitForOthers: function() {
            var compThis = this;
            axios.get('/ready')
                .then(response => {
                    if (response.data.ready) {
                        compThis.global.stage = "play";
                        return;
                    }
                });
            this.waitCheck = setTimeout(this.waitForOthers, 5000);
        }
    },
    beforeDestroy: function() {
        clearTimeout(this.waitCheck);
    }
};

var playComp = {
    template: `
        <div>
            <cheat-sheet></cheat-sheet>
            <scoreboard></scoreboard>

            <hand></hand>
        </div>
    `
};

new Vue({
    el: '#root',
    data: {
        global: globalData
    },
    components: {
        login: loginComp,
        connecting: connectingComp,
        bidding: biddingComp,
        reduce: reduceComp,
        play: playComp
    }
});
