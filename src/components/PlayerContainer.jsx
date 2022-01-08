import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Avatar } from "antd";
import _ from "lodash";
const { Meta } = Card;

function PlayerContainer() {
  const [playerData, setPlayerData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [renderData, setRenderData] = useState([]);

  useEffect(() => {
    axios
      .get("https://api.npoint.io/358ec979bffdb6150669")
      .then(function (response) {
        // handle success

        setPlayerData(response.data);
      })
      .catch(function (error) {
        // handle error
      })
      .then(function () {
        // always executed
      });
  }, []);

  useEffect(() => {
    if (playerData.length) {
      const playerDataGrp = _.keyBy(playerData, "id"); 

      _.forEach(playerDataGrp, (value) => {
        value.scores = [];
        value.matchesScore = [];
        value.showSingleDetails = false;
      });

      axios
        .get("https://api.npoint.io/9676bd6215aaef1acb73")
        .then(function (response) {
          // handle success

          response.data.map((matchData, idx) => {
            // education: {degree}
            const { player1, player2, match } = matchData;

            if (playerDataGrp[player1.id]) {
              playerDataGrp[player1.id].scores.push(player1.score);
              playerDataGrp[player1.id].matchesScore.push({
                match,
                score: player1.score,
              });
            }
            if (playerDataGrp[player2.id]) {
              playerDataGrp[player2.id].scores.push(player2.score);
              playerDataGrp[player2.id].matchesScore.push({
                match,
                score: player2.score,
              });
            }
          });

          setRenderData(Object.values(playerDataGrp));
        })
        .catch(function (error) {
          // handle error
        })
        .then(function () {
          // always executed
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [playerData]);

  const openDetails = (data) => {
    data.showSingleDetails = true;
    const dataTemp = renderData.map((el) => {
      if (el.id === data.id) {
        el.showSingleDetails = true;
      } else {
        el.showSingleDetails = false;
      }
      return el;
    });
    setRenderData(dataTemp);
  };

  return (
    <div>
      {renderData && renderData.map((player, index) => {
        const { id, icon, name, scores, matchesScore, showSingleDetails } =
          player;
        const scoreSum = scores.reduce((acc, el, idx) => {
          acc += el;
          return acc;
        }, 0);
        return (
          <div key={`${id}#${index}`}>
            <Card
              style={{ width: 300, marginTop: 16 }}
              loading={loading}
              onClick={() => {
                openDetails(player);
              }}
            >
              <Meta
                avatar={<Avatar src={icon} />}
                title={`${name}`}
                description={`Score - ${scoreSum}`}
              />
            </Card>
            <ul>
              {showSingleDetails &&
                matchesScore.map((eachMatchScore, indx) => {
                  return (
                    <li
                      key={`${id}#${eachMatchScore.score}#${indx}`}
                    >{`Match - ${eachMatchScore.match}, Score - ${eachMatchScore.score}`}</li>
                  );
                })}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

export default PlayerContainer;
