import { Injectable } from '@angular/core';
import { Deserializable } from './deserializable.model';

export type TestArtifactResponse = {
  filename: string;
  downloadURL: string;
};

@Injectable()
export class TestArtifact implements Deserializable {
  filename: string;
  downloadURL: string;

  deserialize(testCaseData: TestArtifactResponse) {
    this.filename = testCaseData.filename;
    this.downloadURL = testCaseData.downloadURL;

    return this;
  }
}
