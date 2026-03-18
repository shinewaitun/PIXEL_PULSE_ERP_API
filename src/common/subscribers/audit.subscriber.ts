import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  SoftRemoveEvent,
  UpdateEvent,
} from 'typeorm';
import { userContext } from '../interceptors/user.context';

@EventSubscriber()
export class AuditSubscriber implements EntitySubscriberInterface {
  beforeInsert(event: InsertEvent<any>) {
    const userId = userContext.getStore();
    if (!event.entity || userId == null) return;

    event.entity.creator ??= userId;
    event.entity.updater = userId;
  }

  beforeUpdate(event: UpdateEvent<any>) {
    const userId = userContext.getStore();
    if (!event.entity || userId == null) return;

    event.entity.updater = userId;
  }

  beforeSoftRemove(event: SoftRemoveEvent<any>) {
    const userId = userContext.getStore();
    if (!event.entity || userId == null) return;

    event.entity.deleter = userId;
  }
}
