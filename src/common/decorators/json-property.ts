/// https://stackoverflow.com/questions/45075826/json-property-alias-in-typescript
/// Used like that:
/// @JsonProperty("Microsoft.VSTS.Scheduling.StoryPoints")
/// get StoryPoints(): number { return 0 };

/*
function JsonProperty(name: string) {
  return function DoJsonProperty(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
      descriptor.get = function () {
          return this.data[name];
      }
      descriptor.set = function (value) {
          this.data[name] = value;
      }
  }
}
*/
