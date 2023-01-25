export class Employee {
  public static readonly LAST_NAME_FIELD_NAME = 'lastName';
  public static readonly FIRST_NAME_FIELD_NAME = 'firstName';
  public static readonly STREET_FIELD_NAME = 'street';
  public static readonly POSTCODE_FIELD_NAME = 'postcode';
  public static readonly CITY_FIELD_NAME = 'city';
  public static readonly PHONE_FIELD_NAME = 'phone';
  public static readonly ALL_FIELDS = [
    this.LAST_NAME_FIELD_NAME,
    this.FIRST_NAME_FIELD_NAME,
    this.STREET_FIELD_NAME,
    this.POSTCODE_FIELD_NAME,
    this.CITY_FIELD_NAME,
    this.PHONE_FIELD_NAME,
  ];

  constructor(
    public id?: number,
    public lastName?: string,
    public firstName?: string,
    public street?: string,
    public postcode?: string,
    public city?: string,
    public phone?: string,
    public skillSet?: string[]
  ) {}
}
