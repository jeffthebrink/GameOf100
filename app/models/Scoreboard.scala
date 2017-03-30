//object Team {
//  val players: List[String]
//  def teamNumber(): Int
//}

class ScoreBoard (bid, bidWinner, teamOneScore, teamTwoScore, bidWinningTeam) {

  val score = (trickScore: Int) => trickScore + score

  def addBid(bid, winner) // set the bid and the bidWinner

  // ONLY need to pass in bid winning team's score
  def addTrickScoreBidWinner(score)  // add score as appropriate

  override def toString
}

object GameOf100 {
  def main() = {

    var scoreBoard = new ScoreBoard()
    scoreBoard addBid(71,"Nathan")
    // PLAY HAND
    scoreBoard addTrickScoreBidWinner(99)

    scoreBoard addBid (62,"Jeff")
    // PLAY HAND
    scoreBoard addTrickScoreBidWinner(62)

    scoreBoard addBid (71,"Amber")
    // PLAY HAND
    scoreBoard addTrickScoreBidWinner(67)

    scoreBoard addBid (80,"Blake")
    // PLAY HAND
    scoreBoard addTrickScoreBidWinner(65)

    println(scoreBoard)
  }
}
