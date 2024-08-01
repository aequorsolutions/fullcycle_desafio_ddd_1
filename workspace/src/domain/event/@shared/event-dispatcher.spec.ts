import Address from "../../entity/address";
import Customer from "../../entity/customer";
import CustomerAddressChangedEvent from "../customer/customer-address-changed.event";
import CustomerCreatedEvent from "../customer/customer-created.event";
import SendConsoleLogHandler from "../customer/handler/send-console-log-when-customer-address-is-changed.handler";
import SendConsoleLog1Handler from "../customer/handler/send-console-log1-when-customer-is-created.handler";
import SendConsoleLog2Handler from "../customer/handler/send-console-log2-when-customer-is-created.handler";
import SendEmailWhenProductIsCreatedHandler from "../product/handler/send-email-when-product-is-created.handler";
import ProductCreatedEvent from "../product/product-created.event";
import EventDispatcher from "./event-dispatcher";

describe("Domain events tests", () => {
  it("should register an event handler", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();

    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"]
    ).toBeDefined();
    expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(
      1
    );
    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toBe(eventHandler);
  });

  it("should unregister an event handler", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();

    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toBe(eventHandler);

    eventDispatcher.unregister("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"]
    ).toBeDefined();
    expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(
      0
    );
  });

  it("should unregister all event handlers", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();

    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toBe(eventHandler);

    eventDispatcher.unregisterAll();

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"]
    ).toBeUndefined();
  });

  it("should notify all event handlers", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();
    const spyEventHandler = jest.spyOn(eventHandler, "handle");

    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toBe(eventHandler);

    const productCreatedEvent = new ProductCreatedEvent({
      name: "Product 1",
      description: "Product 1 description",
      price: 10.0,
    });

    // Quando o notify for executado o SendEmailWhenProductIsCreatedHandler.handle() deve ser chamado
    eventDispatcher.notify(productCreatedEvent);

    expect(spyEventHandler).toHaveBeenCalled();
  });

  it("should register an event handler when customer is created", () => {
    const eventDispatcher = new EventDispatcher();
    
    const eventHandler1 = new SendConsoleLog1Handler();
    eventDispatcher.register("CustomerCreatedEvent", eventHandler1);

    const eventHandler2 = new SendConsoleLog2Handler();
    eventDispatcher.register("CustomerCreatedEvent", eventHandler2);

    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"]
    ).toBeDefined();
    expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length).toBe(
      2
    );

    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]
    ).toBe(eventHandler1);
    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]
    ).toBe(eventHandler2);
  });
  
  it("should notify all event handlers when customer is created", () => {
    const eventDispatcher = new EventDispatcher();
    
    const eventHandler1 = new SendConsoleLog1Handler();
    eventDispatcher.register("CustomerCreatedEvent", eventHandler1);

    const eventHandler2 = new SendConsoleLog2Handler();
    eventDispatcher.register("CustomerCreatedEvent", eventHandler2);
    const spyEventHandler1 = jest.spyOn(eventHandler1, "handle");
    const spyEventHandler2 = jest.spyOn(eventHandler2, "handle");

    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"]
    ).toBeDefined();
    expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length).toBe(
      2
    );
    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]
    ).toBe(eventHandler1);
    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]
    ).toBe(eventHandler2);

    const customerCreatedEvent = new CustomerCreatedEvent({
      id: "1",
      name: "John",
      address: "José Bonifacio, SP",
    });

    eventDispatcher.notify(customerCreatedEvent);

    expect(spyEventHandler1).toHaveBeenCalled();
    expect(spyEventHandler2).toHaveBeenCalled();

  });

  it("should notify all event handlers when customer address is changed", () => {
    const eventDispatcher = new EventDispatcher();
    
    const eventHandler1 = new SendConsoleLog1Handler();
    eventDispatcher.register("CustomerCreatedEvent", eventHandler1);

    const eventHandler2 = new SendConsoleLog2Handler();
    eventDispatcher.register("CustomerCreatedEvent", eventHandler2);
    
    const eventHandler3 = new SendConsoleLogHandler();
    eventDispatcher.register("CustomerAddressChangedEvent", eventHandler3);

    const spyEventHandler1 = jest.spyOn(eventHandler1, "handle");
    const spyEventHandler2 = jest.spyOn(eventHandler2, "handle");
    const spyEventHandler3 = jest.spyOn(eventHandler3, "handle");


    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"]
    ).toBeDefined();
    expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length).toBe(
      2
    );
    
    expect(
      eventDispatcher.getEventHandlers["CustomerAddressChangedEvent"]
    ).toBeDefined();
    expect(eventDispatcher.getEventHandlers["CustomerAddressChangedEvent"].length).toBe(
      1
    );

    expect(
      eventDispatcher.getEventHandlers["CustomerAddressChangedEvent"][0]
    ).toBe(eventHandler3);

    const customer = new Customer("1","John")

    const customerCreatedEvent = new CustomerCreatedEvent({
      id: customer.id,
      name: customer.name,
      address: customer.Address,
    });

    eventDispatcher.notify(customerCreatedEvent);
    
    const newAddress = new Address("Rua José Bonifacio", 1222, "09898-092", "SP");
    customer.changeAddress(newAddress);
    
    const customerAddressChangedEvent = new CustomerAddressChangedEvent({
      id: customer.id,
      name: customer.name,
      address: customer.Address,
    })

    eventDispatcher.notify(customerAddressChangedEvent);

    expect(spyEventHandler1).toHaveBeenCalled();
    expect(spyEventHandler2).toHaveBeenCalled();
    expect(spyEventHandler3).toHaveBeenCalled();

  });
});
