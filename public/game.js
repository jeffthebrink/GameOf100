// CHANGE PLAYER NAME TO PLAYER NUMBER

class Player {
    constructor(number) {
        this.number = number;
        this.bid = "--";
    }

    loadData(data) {
        this.originalData = data;
        for (let field in data) {
            this[field] = data[field];
        }
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

Vue.component('login', {
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
                username: '',
                game: ''
            }),
            games: []
        };
    },
    mounted: function() {
        axios.get('games')
            .then(response => {
                this.games = response.data;
            });
    },
    methods: {
        joinGameSubmit: function() {
            this.joinGame.submit("/join-game")
                .then(data => {
                    this.$emit('submit', data);
                });
        }
    }
});

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

Vue.component('scoreboard', {
    props: ['score'],
    template: `
    <div style="margin-left: 10px">
        <table style="display: inline-block">
            <tr><th>Team 1</th></tr>
            <tr><td>{{score.team1Score}}</td></tr>
        </table>

        <table style="display: inline-block; margin-left: 70px">
            <tr><th>Team 2</th></tr>
            <tr><td>{{score.team2Score}}</td></tr>
        </table>
    </div>

    <table>
        <tr>
            <th>Team 1</th>
            <th>Bid Info</th>
            <th>Team 2</th>
        </tr>
        <tr is="roundScore" v-for="round in score.rounds" :round="round"></tr>
    </table>
    `,
    data: function() {
        return {

        };
    }
}); // Todo

Vue.component('roundScore', {
    props: ['round'],
    template: `
        <tr>
            <td>{{round.team1}}</td>
            <td>{{round.bid}} <span :class="arrow"></span></td>
            <td>{{round.team2}}</td>
        </tr>
    `,
    computed: {
        arrow: function() {
            if (this.round.bidTeam == 1) {
                return "glyphicon glyphicon-arrow-left";
            } else {
                return "glyphicon glyphicon-arrow-right";
            }
        }
    }
});

Vue.component('bid-grid', {
    props: ['players', 'user'],
    template: `
    <div class="col-md-4 col-md-offset-4">
        <bid-box v-for="player in players" :player="player"></bid-box>
    </div>
    `,
});

Vue.component('bid-box', {
    props: ['player'],
    template: `
    <div class="col-md-6">
        {{ player.name }}
        <h1>{{ player.bid }}</h1>
        <div v-if="myTurn">
            <input type="number" :min="player.bid" :value="player.bid">
            <button name="button">Bid</button>
            <button name="button">Pass</button>
        </div>
    </div>
    `,
    computed: {
        myTurn() {
            return (this.player == this.$root.$data.user) && (this.player == this.$root.$data.currentBidder);
        }
    }
});

Vue.component('banner', {
    props: {
        stage: {
            type: String,
            required: true
        },
        player: {
            type: Player,
            required: true
        }
    },
    template: `
    <div class="col-md-4 col-md-offset-2" style="margin-top: 100px">
        <div class="col-md-12" style="background-color: black; opacity: 0.5; color: white">
            <h3>Stage: {{ this.stage }}</h3>
        </div>
        <div class="col-md-12" style="background-color: black; opacity: 0.5; color: white; margin-top: 10px">
            <h4>{{ stageMessage }}</h4>
        </div>
    </div>
    `,
    computed: {
        stageMessage: function() {
            if (this.stage === "Bidding") {
                return 'Current Bidder: ' + this.player.name;
            } else if (this.stage === "Reduce") {
                return 'Cat Winner: ' + this.player.name;
            }
        }
    }
});

Vue.component('cat', {
    template: `
    <div class="col-md-6 col-md-offset-3" style="background-color: cyan">
        <card v-for="card in cat" :card="card"></card>
    </div>
    `,
    mounted: function() {
        axios.get()
            .then();
    },
    data: function() {
        return {

        };
    }
});

Vue.component('card', {

});

new Vue({
    el: '#root',
    data: {
        stage: "Login", // Login, Bidding, Reduce, Play
        players: {
            player1: new Player(1),
            player2: new Player(2),
            player3: new Player(3),
            player4: new Player(4)
        },
        user: undefined,
        currentBidder: undefined,
        leader: undefined,
        hand: [],
        score: {
            team1Score: 0,
            team2Score: 0,
            roundScores: {} // Bid, team1 or team2 , score
        }
    },
    computed: {
        loginStage() {
            return this.stage == "Login";
        },
        focusPlayer() {
            if (this.stage == "Bidding") {
                return this.currentBidder;
            } else if (this.stage == "Reduce") {
                return this.leader;
            }
        }
    },
    methods: {
        load: function(name) {
            axios.get("/load/" + name)
                .then(response => {
                    this.players[name].loadData(response.data);
                });
        },
        loggedIn: function(data) {
            this.user = this.players[data.name];
            this.currentBidder = this.user;
            this.stage = "Bidding";
        }
    }
});
