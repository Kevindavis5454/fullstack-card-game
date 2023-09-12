export default class Zone {
  constructor(scene) {
    // Left the Drop Zone in for future game uses
    this.renderZone = () => {
      // (x, y, width, height)
      let dropZone = scene.add.zone(700, 375, 900, 250).setRectangleDropZone(900, 250);
      // set the data of the dropzone
      dropZone.setData({ cards: 0 });
      return dropZone;
    };

    this.renderOutline = (dropZone) => {
      let dropZoneOutline = scene.add.graphics();
      dropZoneOutline.lineStyle(4, 0xff69b4);
      dropZoneOutline.strokeRect(dropZone.x - dropZone.input.hitArea.width/2, dropZone.y - dropZone.input.hitArea.height/2, dropZone.input.hitArea.width, dropZone.input.hitArea.height);
    }
  }
}