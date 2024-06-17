using BE.Models;
using BE.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace BE.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class OrderController : ControllerBase {
    private readonly IOrderRepository _orderRepository;

    public OrderController(IOrderRepository orderRepository) {
        _orderRepository = orderRepository;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllOrders() {
        // var orders = await _orderRepository.GetAllOrders();
        // return Ok(orders);
        try {
            var orders = await _orderRepository.GetAllOrders();

            if (orders == null) {
                return NotFound();
            }

            return Ok(orders);
        }
        catch {
            return StatusCode(500, "ERROR");
        }
    }

    [HttpGet("{id:length(24)}")]
    public async Task<IActionResult> GetById(string id) {
        try {
            var order = _orderRepository.GetById(id);

            if (order == null) {
                return NotFound();
            }

            return Ok(order);
        }
        catch {
            return StatusCode(500, "ERROR");
        }
    }

    [HttpPost]
    public async Task<IActionResult> Create(Order order) {
        try {
            var result = await _orderRepository.Create(order);

            if (result == false) {
                return NotFound("INVALID input");
            }

            return Ok(order);
        }
        catch {
            return StatusCode(500, "ERROR");
        }
    }

    [HttpPatch("{id:length(24)}")]
    public async Task<IActionResult> Update(string id, string? customerId, string? transactStatusId, bool? paid, int? totalMoney) {
        try {
            var result = await _orderRepository.Update(id, customerId, transactStatusId, paid, totalMoney);

            if (result == false) {
                return NotFound("INVALID input");
            }

            return Ok("Update Successfully");
        }
        catch {
            return StatusCode(500, "ERROR");
        }
    }

    [HttpDelete]
    public async Task<IActionResult> Delete(string id) {
        try {
            var result = await _orderRepository.Delete(id);

            if (result == false) {
                return NotFound();
            }

            return Ok("Delete Successfully");
        }
        catch {
            return StatusCode(500, "ERROR");
        }
    }
}