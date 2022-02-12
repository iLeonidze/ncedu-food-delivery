package com.ncedu.fooddelivery.api.v1.services;

import com.ncedu.fooddelivery.api.v1.entities.Courier;

public interface CourierService {
    Courier getCourier(Long id);
    Courier findFreeCourier(Long warehouseId);
}
