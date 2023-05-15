
export default function bound (_: any, { name, addInitializer }: ClassMethodDecoratorContext) {
  addInitializer(function () {
    this[name] = this[name].bind(this);
  });
}
