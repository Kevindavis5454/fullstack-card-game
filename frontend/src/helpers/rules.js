export default class Rules {
  constructor(scene) {
    this.findWinner = (PAV, PBV) => {
      const PAVNumber = Number(PAV);
      const PBVNumber = Number(PBV);
      if (PAV === PBV) {
          scene.data.values.isWarDeclared = true;
          return 'war'
        } else {
          console.log('Win IF');
          if (PAV === 'ACE') {
            return 'Player A';
          };
          if (PBV === 'ACE') {
            return 'Player B';
          }
          if (PAV === 'KING') {
            return 'Player A';
          }
          if (PBV === 'KING') {
            return 'Player B';
          }
          if (PAV === 'QUEEN') {
            return 'Player A';
          }
          if (PBV === 'QUEEN') {
            return 'Player B';
          }
          if (PAV === 'JACK') {
            return 'Player A';
          }
          if (PBV === 'JACK') {
            return 'Player B';
          }
          if (PAVNumber > PBVNumber) {
            return 'Player A';
          }
          if (PBVNumber > PAVNumber) {
            return 'Player B';
          }
        }
    }
  }
}